import {jwtDecode, JwtPayload} from "jwt-decode"
import {defineExtensionMessaging} from "@webext-core/messaging";

export function getUserInfo(jwt: string | undefined): UserInfo | undefined {
    if(jwt === undefined) { return undefined; }
    const userInfo = jwtDecode(jwt);
    return {communities: <string[]>userInfo['communities' as keyof JwtPayload],
            application: 'business-ai', name: <string>userInfo['userName' as keyof JwtPayload],
            roles: <string[]>userInfo['roles' as keyof JwtPayload]} as UserInfo;
}

export interface StateInfo {
    authenticated: boolean;
    processing: boolean;
}

export interface Publication {
    images: string[];
    note: string;
    id: string;
}

export interface LoginData {
    password: string;
    login: string;
}

export interface UserInfo {
    communities: string[] | undefined;
    application: string | undefined;
    roles: string[] | undefined;
    name: string | undefined;
}

export interface Review {
    author: string;
    rating: string;
    text: string;
    time: Date;
    id: string;
}

export interface Response {
    response: string;
    review: string;
    id: string;
}

interface ProtocolMap {
    getStateInfo(): StateInfo;
    getOrganization(): string;
    doResponse(response: Response): void;
    getUnreadReviews(): Review[] | undefined;
    getUnansweredReviews(): Review[] | undefined;
    makePublication(publication: Publication): boolean;
    markReadReviews(review: string): void;
    switchLocation(target: string): void;
    getUserInfo(): UserInfo | undefined;
    processing(flag: boolean): void;
    login(data: LoginData): boolean;
    logout(): void;
}

export const {sendMessage,onMessage} = defineExtensionMessaging<ProtocolMap>();