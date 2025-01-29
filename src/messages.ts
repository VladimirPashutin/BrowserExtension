import {jwtDecode} from "jwt-decode"

export class Publication {
    constructor(imagesUrl: string[],
                note: string, id: string) {
        this.imagesUrl = imagesUrl;
        this.note = note;
        this.id = id;
    }
    imagesUrl: string[];
    note: string;
    id: string;
}

export class UserInfo {
    communities: string[] | undefined;
    application: string | undefined;
    roles: string[] | undefined;
    name: string | undefined;
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