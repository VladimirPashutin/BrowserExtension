import {onMessage,sendMessage,openStream} from "webext-bridge/background";
import {apiUrl,loginUrl,getRequestApiInterval} from "../utils.ts";
import {getUserInfo, Publication} from "../messages.ts";
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
    if(response.ok) { return await response.json(); }
    return null;
}

const getDataFromServer = async (token, url)=> {
    const headers = new Headers();
    let response;
    headers.append("Authorization", token);
    headers.append("Content-Type", "application/octet-stream");
    response = await fetch(apiUrl() + url, {"method": "GET", "headers": headers});
    if(response.ok) { return await response.blob(); }
    return null;
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
            const publicationsData = await exchangeWithServer(accessToken, "GET", "publications");
            console.log("Получены публикации", publicationsData);
            for(const message of publicationsData) {
                for(const imageUrl of message.imagesUrl) {
                    const imageContainer = getDataFromServer(accessToken, apiUrl() + imageUrl);
                    if(imageContainer !== null) {
                        imageContainer.then((data) => {
                            if(data !== null) {
                                openStream('image' + imageUrl,'content-script@' + workingTabId).
                                then((outStream) => { data.stream.pipe(outStream); outStream.close()})
                            }
                        })
                    }
                }
            }
            for(const message of publicationsData) {
                const processed = await sendMessage('publications',
                                                   message, "content-script@" + workingTabId);
                if(processed) { await exchangeWithServer(accessToken, "PUT", "publications/" + message.id); }
            }
            // const unansweredReviews = await sendMessage('unansweredReviews', '',
            //                                                 "content-script@" + workingTabId);
            // if(unansweredReviews)
            // { await getDataFromServer(accessToken, "POST", 'generateReviews', unansweredReviews); }
            // const generatedResponses = await getDataFromServer(accessToken, "GET", "takeResponses");
            // for(const message of generatedResponses)
            // { await sendMessage('doResponse', message, "content-script@" + workingTabId); }
        }
    }, getRequestApiInterval())
    onMessage('stateFlags', () => {
        return { "authenticated": accessToken !== undefined, "processing": processingEnabled }
    })
    onMessage('logout', () => {
        processingEnabled = false
        refreshToken = undefined;
        accessToken = undefined;
    })
    onMessage('processLogin', async (message) => {
        try{
            if(message.sender.tabId === null) {
                const tabs = await chrome.tabs.query({active: true, currentWindow: true});
                workingTabId = tabs[0].id;
            } else { workingTabId = message.sender.tabId; }
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
    onMessage('processing', async ({data}) => {
        processingEnabled = data;
    })
    onMessage('userInfo', () => {
        if(accessToken === undefined) { return null; }
        return getUserInfo(accessToken);
    })
});
