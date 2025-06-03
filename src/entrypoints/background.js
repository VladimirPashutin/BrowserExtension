import {getUserInfo, sendMessage, onMessage, Publication, StateInfo} from "../messaging.ts";
import {apiUrl,loginUrl,getRequestApiInterval} from "../utils.ts";
import {defineBackground} from "wxt/sandbox";
import {encode} from 'js-base64';
import {Md5} from 'ts-md5'

const exchangeWithServer = async (token, method, url, body = undefined) => {
    const headers = new Headers();
    let response;
    headers.append("Authorization", token);
    if(body === undefined) { response = await fetch(apiUrl() + url, {"method": method, "headers": headers}); }
    else { headers.append("Content-Type", "application/json");
        response = await fetch(apiUrl() + url, {"method": method, "headers": headers, "body": JSON.stringify(body)});
    }
    if(response.ok) {
        let contentType = response.headers.get('Content-Type');
        if(contentType !== null && contentType !== undefined) {
            contentType = contentType.toLowerCase();
            if(contentType.includes('application/json'))
            { return response.json(); }
            if(contentType.includes('application/octet-stream') ||
                contentType.includes('image'))
            { return response.blob(); }
        }
        return response.text();
    } else { console.error("Ошибка получения данных"); }
    return null;
}

const getImageFromServer = async (token, url)=> {
    const headers = new Headers();
    let response;
    headers.append("Authorization", token);
    headers.append("Content-Type", "application/octet-stream");
    response = await fetch(apiUrl() + "image/" + url, {"method": "GET", "headers": headers});
    if(response.ok) { return await response.blob(); }
    return null;
}

let targetLocation = undefined;
let currentLocation = undefined;

const currentLocationChanged = () => {
    let timerId;
    let counter = 0;
    const waitForSwitch = (resolve,reject) => {
        if(counter > 30000) { clearTimeout(timerId); reject("Target location unavailable"); }
        else if(targetLocation === undefined) { clearTimeout(timerId); reject("Target undefined"); }
        else if(currentLocation !== undefined && currentLocation.endsWith(targetLocation)) {
            clearTimeout(timerId); resolve();
        } else { counter = counter + 1;
            timerId = setTimeout(waitForSwitch, 100, resolve, reject);
        }
    }
    return new Promise((resolve,reject) => {
        timerId = setTimeout(waitForSwitch, 100, resolve, reject);
    })
}

async function makePublications(publicationsData, accessToken, workingTabId) {
    for(const publication of publicationsData) {
        const images = [];
        for(let i = 0; i < publication.images.length; i++) {
            const image = await getImageFromServer(accessToken, publication.images[i]);
            if(image !== null && image.size > 0) {
                images[i] = encode(image);
            }
        }
        const message = new Publication(images, publication.note, publication.id);
        const processed = await sendMessage('makePublication', message, workingTabId);
        if(processed) { await exchangeWithServer(accessToken, "POST",
                   "publications/yandex-business/" + publication.id);
        }
    }
}

async function processReviews(workingTabId, accessToken) {
    const unansweredReviews = await sendMessage('getUnansweredReviews', null, workingTabId);
    const orgName = await sendMessage('getOrganization', null, workingTabId);
    if(unansweredReviews !== null && unansweredReviews.length > 0) {
        await exchangeWithServer(accessToken, "POST", 'generateReviews/' +
              orgName + '/yandex-business', unansweredReviews);
        for(const review of unansweredReviews) {
            await sendMessage('markReadReviews', review.text, workingTabId);
        }
    }
    const generatedResponses = await exchangeWithServer(accessToken,
         "GET", "takeResponses/" + orgName + "/yandex-business");
    if(generatedResponses !== null && Symbol.iterator in Object(generatedResponses)) {
        for(const message of generatedResponses) {
            await sendMessage('doResponse', message, workingTabId);
            await exchangeWithServer(accessToken, "POST", "/acceptResponse/yandex-business/" + message.id);
        }
    }
}

export default defineBackground(() => {
    let accessToken = undefined;
    let refreshToken = undefined;
    let workingTabId = undefined;
    let processingEnabled = false;
    chrome.runtime.onInstalled.addListener(({reason}) => {
        if (reason === 'install') {
            chrome.tabs.create({url: "https://yandex.ru/sprav"}).then((tab) => {
                workingTabId = tab.id
            });
        }
    });
    setInterval(async () => {
        if(accessToken !== undefined && processingEnabled && workingTabId !== undefined && workingTabId !== null) {
            const orgName = await sendMessage('getOrganization', null, workingTabId);
            const publicationsData = await exchangeWithServer(accessToken,
                 "GET", "publications/" + orgName + "/yandex-business");
            if(publicationsData !== null && publicationsData.length > 0) {
                if(!currentLocation.endsWith("/posts/")) {
                    targetLocation = "/posts";
                    await sendMessage('switchLocation', "posts", workingTabId)
                    currentLocationChanged().then(() => {
                        makePublications(publicationsData, accessToken, workingTabId);
                    })
                } else { await makePublications(publicationsData, accessToken, workingTabId); }
            }
            if(!currentLocation.endsWith("/reviews/")) {
                targetLocation = "/reviews";
                await sendMessage('switchLocation', "reviews", workingTabId)
                currentLocationChanged().then(() => { processReviews(workingTabId, accessToken); })
            } else { await processReviews(workingTabId, accessToken); }
        }
    }, getRequestApiInterval())
    onMessage('getStateInfo', async (message) => {
        if(message.sender.tab.id === null) {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            workingTabId = tabs[0].id;
        } else { workingTabId = message.sender.tab.id; }
        currentLocation = message.data;
        return new StateInfo(accessToken !== undefined, processingEnabled);
    })
    onMessage('logout', () => {
        processingEnabled = false
        refreshToken = undefined;
        accessToken = undefined;
    })
    onMessage('processLogin', async (message) => {
        try {
            const request = { "application": "business-ai", "authType": "BEARER",
                                   "credentials": encode(message.data.login + "::" +
                                    Md5.hashStr(message.data.password))}
            const tokens = await fetch(loginUrl() + 'login', {"method": "POST",
                "headers": { "Content-Type": "application/json" }, "body": JSON.stringify(request)})
            if(tokens.ok) {
                const tokensValue = await tokens.json()
                refreshToken = tokensValue.refreshToken;
                accessToken = tokensValue.accessToken;
                return true
            }
        } catch (e) { console.error("Регистрация невозможна", e); }
        refreshToken = undefined;
        accessToken = undefined;
        return false;
    })
    onMessage('processing', ({data}) => {
        processingEnabled = data;
    })
    onMessage('getUserInfo', () => {
        if(accessToken === undefined) { return null; }
        return getUserInfo(accessToken);
    })
});
