import {StateInfo, getUserInfo, sendMessage, onMessage, Publication} from "../messaging.ts";
import {apiUrl,loginUrl,getRequestApiInterval} from "../utils.ts";
import {defineBackground} from "wxt/sandbox";
import {jwtDecode} from "jwt-decode"
import {encode} from "js-base64";
import {Md5} from 'ts-md5'

const exchangeWithServer = async (token: string, method: string, url: string,
                                  body: undefined | any = undefined) => {
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

const getImageFromServer = async (token: string, url: string)=> {
    const headers = new Headers();
    let response;
    headers.append("Authorization", token);
    headers.append("Content-Type", "application/octet-stream");
    response = await fetch(apiUrl() + "image/" + url, {"method": "GET", "headers": headers});
    if(response.ok) { return await response.blob(); }
    return null;
}

const blobToBase64 = async (blob: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    })
}

const makePublications = async (publicationsData: Publication[], accessToken: string,
                                workingTabId: number) => {
    for(const publication of publicationsData) {
        console.log("Формируем публикацию");
        const images: string[] = [];
        for(let i = 0; i < publication.images.length; i++) {
            const image = await getImageFromServer(accessToken, publication.images[i]);
            //@ts-ignore
            if(image !== null && image.size > 0) { images.push(await blobToBase64(image)); }
        }
        const message = { images: images, note: publication.note, id: publication.id};
        const processed = await sendMessage('makePublication', message, workingTabId);
        if(processed) { await exchangeWithServer(accessToken, "POST",
          "publications/yandex-business/" + publication.id);
        }
    }
}

const processReviews = async (firstStart: boolean, workingTabId: number, accessToken: string) => {
    let unansweredReviews;
    if(firstStart) { unansweredReviews = await sendMessage('getUnansweredReviews', undefined, workingTabId); }
    else { unansweredReviews = await sendMessage('getUnreadReviews', undefined, workingTabId); }
    const orgName = await sendMessage('getOrganization', undefined, workingTabId);
    if(unansweredReviews !== undefined && unansweredReviews.length > 0) {
        console.log("Собираем отзывы");
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
            console.log("Публикуем ответ");
            await sendMessage('doResponse', message, workingTabId);
            await exchangeWithServer(accessToken, "POST", "/acceptResponse/yandex-business/" + message.id);
        }
    }
}

export default defineBackground(() => {
    let firstStart = true;
    let processingEnabled = false;
    let accessToken: undefined | string = undefined;
    let refreshToken: undefined | string = undefined;
    let workingTabId: undefined | number = undefined;
    let currentLocation: undefined | string = undefined;
    let timer: ReturnType<typeof setInterval> | undefined = undefined;
    chrome.runtime.onInstalled.addListener(({reason}) => {
        if (reason === 'install') {
            chrome.tabs.create({url: "https://yandex.ru/sprav"}).then((tab) => {
                workingTabId = tab.id
            });
        }
    });
    const checkEnvironment = async (message: any) => {
        if((message.sender.tab === undefined || message.sender.tab.id === undefined ||
            message.sender.tab.id === null) && workingTabId === undefined) {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            workingTabId = tabs[0].id;
        } else if(!(message.sender.tab === undefined || message.sender.tab.id === undefined ||
                    message.sender.tab.id === null))
        { workingTabId = message.sender.tab.id; }
        currentLocation = message.sender.url;
    }
    const refreshTokens = async () => {
        try { const aToken = jwtDecode(<string>accessToken);
            const rToken = jwtDecode(<string>refreshToken);
            if(<number>rToken.exp < Date.now() / 1000 + 120) {
                const tokens = await fetch(loginUrl() + 'refresh', {"method": "POST",
                     "headers": { "Content-Type": "application/json" }, "body": '{"refreshToken": "' +
                      refreshToken + '", "accessToken": "' + accessToken + '"}'})
                if(tokens.ok) {
                    const tokensValue = await tokens.json()
                    refreshToken = tokensValue.refreshToken;
                    accessToken = tokensValue.accessToken;
                    return true
                }
            } else if(<number>aToken.exp < Date.now() / 1000 + 60) {
                const response = await fetch(loginUrl() + 'token',
                           {"method": "POST", "body": " + accessToken + "});
                accessToken = await response.text();
            }
        } catch (e) { console.error("Ошибка обновления токенов", e); }
    }
    const doProcessing = async () => {
        if(accessToken !== undefined && workingTabId !== undefined) {
            const orgName = await sendMessage('getOrganization', undefined, workingTabId);
            const publicationsData: Publication[] = await exchangeWithServer(accessToken,
                "GET", "publications/" + orgName + "/yandex-business");
            if(publicationsData !== null && publicationsData !== undefined && publicationsData.length > 0) {
                if(currentLocation === undefined || !currentLocation.endsWith("/posts/"))
                { await sendMessage('switchLocation', "/posts/", workingTabId); }
                else { await makePublications(publicationsData, accessToken, workingTabId); }
            } else if(currentLocation === undefined || !currentLocation.endsWith("/reviews/"))
            { await sendMessage('switchLocation', "/reviews/", workingTabId); }
            else { await processReviews(firstStart, workingTabId, accessToken);
                firstStart = false;
            }
        }
    }
    onMessage('getStateInfo', async (message) => {
        await checkEnvironment(message);
        return { processing: processingEnabled, authenticated: accessToken !== undefined } as StateInfo;
    })
    onMessage('logout', async (message) => {
        await checkEnvironment(message);
        processingEnabled = false
        refreshToken = undefined;
        accessToken = undefined;
    })
    onMessage('login', async (message) => {
        try { await checkEnvironment(message);
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
    onMessage('processing', async (message) => {
        await checkEnvironment(message);
        processingEnabled = message.data;
        if(processingEnabled) {
            timer = setInterval(async () => {
                await refreshTokens();
                if(processingEnabled)
                { await doProcessing(); }
            }, getRequestApiInterval());
        } else { clearInterval(timer); }
    })
    onMessage('getUserInfo', async (message) => {
        await checkEnvironment(message);
        if(accessToken === undefined) { return undefined; }
        return getUserInfo(accessToken);
    })
});
