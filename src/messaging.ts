import {defineExtensionMessaging} from "@webext-core/messaging";
import {jwtDecode} from "jwt-decode"

export interface StateInfo {
    authenticated: boolean
    processing: boolean
}

export class Publication {
    constructor(images: string[],
                note: string, id: string) {
        this.images = images;
        this.note = note;
        this.id = id;
    }
    images: string[];
    note: string;
    id: string;
}

export interface LoginData {
    password: string;
    login: string;
}

export class UserInfo {
    communities: string[] | undefined;
    application: string | undefined;
    roles: string[] | undefined;
    name: string | undefined;
}

export class ReviewInfo {
    constructor(id: string, time: Date, author: string,
                rating: string, text: string) {
        this.author = author;
        this.rating = rating;
        this.text = text;
        this.time = time;
        this.id = id;
    }
    author: string;
    rating: string;
    text: string;
    time: Date;
    id: string;
}

export class GeneratedResponse {
    constructor(id: string, review: string, response: string) {
        this.response = response;
        this.review = review;
        this.id = id;
    }
    response: string;
    review: string;
    id: string;
}

export function getUserInfo(jwt: string): UserInfo {
    const result = new UserInfo();
    const userInfo = jwtDecode(jwt);
    // @ts-ignore
    result.communities = userInfo['communities'];
    result.application = 'business-ai';
    // @ts-ignore
    result.name = userInfo['userName'];
    // @ts-ignore
    result.roles = userInfo['roles'];
    return result;
}

interface ProtocolMap {
    processLogin(data: LoginData): boolean;
    makePublication(publication: Publication): boolean;
    doResponse(response: GeneratedResponse): void;
    getStateInfo(location: string): StateInfo;
    switchLocation(target: string): void;
    getUnansweredReviews(): ReviewInfo[];
    processing(flag: boolean): void;
    getUserInfo(): UserInfo;
    logout(): void;
}

export const {sendMessage,onMessage} = defineExtensionMessaging<ProtocolMap>();