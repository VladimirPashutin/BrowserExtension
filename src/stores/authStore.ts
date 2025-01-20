
// @ts-ignore
import {loginUrl} from "../entrypoints/popup/main.ts";
import {jwtDecode} from "jwt-decode";
import { defineStore } from 'pinia'
import {encode} from "js-base64";
import {Md5} from "ts-md5";

interface Tokens {
    refreshToken: string
    accessToken: string
}

type Params = {
    [key: string]: any
}

interface User {
    application: string
    params?: Params[]
    roles: string[]
    subject: string
    name: string
    id: string
}

interface AuthState {
    user: User | null
    tokens: Tokens | null
    isAuthenticated: boolean
}

interface LoginData {
    password: string
    login: string
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        isAuthenticated: false,
        tokens: null,
        user: null
    }),
    actions: {
        clearAuthentication() {
            this.isAuthenticated = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.token = null;
            this.user = null;
        },
        async checkAuth() {
            try { const accessToken = localStorage.getItem('accessToken');
                if(accessToken) {
                    const jwtToken = jwtDecode(accessToken);
                    this.user = { id: jwtToken['id'],
                        application: jwtToken['application'],
                        name: jwtToken['userName'],
                        roles: jwtToken['roles']
                    }
                    this.tokens = { accessToken: accessToken,
                        refreshToken: localStorage.getItem('refreshToken')
                    };
                    this.isAuthenticated = true;
                } else { return false; }
            } catch {
                this.clearAuthentication();
                return false;
            }
        },
        getAuthToken(): string {
            if(!this.tokens) {
                this.tokens = { accessToken: localStorage.getItem('accessToken'),
                    refreshToken: localStorage.getItem('refreshToken')
                };
            }
            return this.tokens.accessToken;
        },
        setTokens(tokens: Tokens) {
            const jwtToken = jwtDecode(tokens.accessToken);
            if(jwtToken) {
                this.user = { id: jwtToken['id'],
                     application: jwtToken['application'],
                     name: jwtToken['userName'],
                     roles: jwtToken['roles'],
                     subject: jwtToken['sub']
                }
                this.tokens = tokens;
                this.isAuthenticated = true;
                localStorage.setItem('accessToken', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);
            } else { this.clearAuthentication(); }
        },
        async login(value: LoginData) {
            try { const credentials = encode(value.login + "::" + Md5.hashStr(value.password));
                const response = await fetch(loginUrl() + "login",
                    { method: 'POST', headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ application: 'business-ai', credentials: credentials, authType: "BEARER" })
                })
                if(response.ok) {
                    response.json().then((data: Tokens) => {
                        this.setTokens(data)
                    })
                } else { console.error('Login error - ', response.status);
                    this.clearAuthentication();
                }
            } catch (error) { console.error('Login error:', error);
                this.clearAuthentication();
            }
        },
        logout() {
            this.clearAuthentication();
            window.location.replace("/");
        }
    }
})