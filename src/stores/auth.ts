import { defineStore } from 'pinia'

interface User {
    email: string
    name: string
    id: string
}

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    user: User | null
    loading: boolean
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        isAuthenticated: false,
        loading: true,
        token: null,
        user: null
    }),
    actions: {
        setUser(user: User){
            this.isAuthenticated = true
            this.user = user
        },
        setToken(token: string) {
            localStorage.setItem('token', token)
            this.token = token
        },
        clearAuth() {
            this.user = null
            this.token = null
            this.isAuthenticated = false
            localStorage.removeItem('token')
        },
        async login(email: string, password: string) {
            try { const response = await fetch('${import.meta.env.WXT_AUTH_LOGIN_URL}', {
                  body: JSON.stringify({ username: email, password: password }),
                  method: 'POST'
                })
                if(response.ok) {
                    response.json().then((data) => {
                        this.setToken(data)
                    })
                } else {
                    console.error('Login error - ', response.status)
                }
                this.setToken(response.token)
            } catch (error) {
                console.error('Login error:', error)
            }
        }
    }
})