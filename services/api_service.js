const API_URL = "https://business.t3t.online/api";
const loginStorageKey = 'yandexBusinessAIAssistantLogin';
const tokenStorageKey = 'yandexBusinessAIAssistantToken';


const api_service = {

    async checkLogin() {


        const token = await new Promise((resolve, reject) => {
            chrome.storage.local.get([tokenStorageKey], function (result) {
                if (result[tokenStorageKey]) {
                    resolve(result[tokenStorageKey]);
                } else {
                    reject('No token found');
                }
            });
        });
        const login = await new Promise((resolve, reject) => {
            chrome.storage.local.get([loginStorageKey], function (result) {
                if (result[loginStorageKey]) {
                    resolve(result[loginStorageKey]);
                } else {
                    reject('No login found');
                }
            });
        });

        let isLogged = token ? true : false;
        return {
            'isLogged': isLogged,
            'token': token,
            'username': login

        };
    },

    async login(username, password) {
        const apiUrl = await this.getApiUrl();
        const response = await fetch(await this.getAuthUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.access_token;
            chrome.storage.local.set({ [tokenStorageKey]: token }, function () {
                console.log('Token stored successfully');
            });
            chrome.storage.local.set({ [loginStorageKey]: username }, function () {
                console.log('Username stored successfully');
            });
        } else {
            throw new Error('Login failed');
        }
    },

    async logout() {
        chrome.storage.local.remove([tokenStorageKey], function () {
            console.log('Token removed successfully');
        });
        chrome.storage.local.remove([loginStorageKey], function () {
            console.log('Username removed successfully');
        });
    },

    async ping() {

        const requestPayload = {
            jsonrpc: "2.0",
            method: "ping",
            params: [],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
            } else {
                console.log("Ping result:", result.result);
                return result.result;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    },

    async getResult(operationId) {

        const requestPayload = {
            jsonrpc: "2.0",
            method: "get_result",
            params: [
                {
                    name: "operation_id",
                    value: operationId
                }
            ],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
            } else {
                console.log("Result:", result.result);
                return result.result;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    },

    async reviewResponseGenerate(
        author,
        rate,
        reviewText,
        photos
    ) {

        const requestPayload = {
            jsonrpc: "2.0",
            method: "answer_review",
            params: [
                {
                    name: "rate",
                    value: rate
                },
                {
                    name: "author",
                    value: author
                },
                {
                    name: "full_text",
                    value: reviewText
                },
                {
                    name: "photos",
                    value: photos
                }
            ],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
                return {
                    status: 'error',
                    response: error
                }
            } else {
                console.log("Review response:", result.result);
                return result.result;
            }
        } catch (error) {

            console.error("Network error:", error);
            return {
                status: 'error',
                response: error
            }
        }
    },

    async getScheduledPost() {

        const requestPayload = {
            jsonrpc: "2.0",
            method: "scheduled_post",
            params: [],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
            } else {
                console.log("Scheduled post:", result.result);
                return result.result;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    },

    async markPostAsPublished(postId) {
        const requestPayload = {
            jsonrpc: "2.0",
            method: "mark_post_as_published",
            params: [
                {
                    name: "post_id",
                    value: postId
                }
            ],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
            } else {
                console.log("Mark post as published:", result.result);
                return result.result;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    },



    async getIssueAll() {

        const requestPayload = {
            jsonrpc: "2.0",
            method: "existed_issue",
            params: [],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
            } else {
                console.log("Issue all:", result.result);
                return result.result;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    },

    async getReviewIssue(reviewId) {

        const requestPayload = {
            jsonrpc: "2.0",
            method: "get_issue",
            params: [
                {
                    name: "review_id",
                    value: reviewId
                }
            ],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
            } else {
                console.log("Issue get:", result.result);
                return result.result;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    },

    async createReviewIssue(
        reviewId,
        reviewAuthor,
        reviewTime,
        reviewRate,
        reviewText
    ) {

        const requestPayload = {
            jsonrpc: "2.0",
            method: "create_issue",
            params: [
                {
                    name: "review_id",
                    value: reviewId
                },
                {
                    name: "review_author",
                    value: reviewAuthor
                },
                {
                    name: "review_time",
                    value: reviewTime
                },
                {
                    name: "review_rate",
                    value: reviewRate
                },
                {
                    name: "review_text",
                    value: reviewText
                }
            ],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
            } else {
                console.log("Issue create:", result.result);
                return result.result;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    },

    async markIssueAsPublished(
        reviewId
    ) {

        const requestPayload = {
            jsonrpc: "2.0",
            method: "mark_issue_as_published",
            params: [
                {
                    name: "review_id",
                    value: reviewId
                }
            ],
            id: 1
        };

        try {
            const token = await new Promise((resolve, reject) => {
                chrome.storage.local.get([tokenStorageKey], function (result) {
                    if (result[tokenStorageKey]) {
                        resolve(result[tokenStorageKey]);
                    } else {
                        reject('No token found');
                    }
                });
            });

            const response = await fetch(await this.getRpcUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();
            if (result.error) {
                console.error("Error:", result.error);
            } else {
                console.log("Issue published:", result.result);
                return result.result;
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    },




    async getApiUrl() {

        const apiUrl = await new Promise((resolve, reject) => {
            chrome.storage.local.get(['apiUrl'], function (result) {
                if (result['apiUrl']) {
                    resolve(result['apiUrl']);
                } else {
                    resolve();
                }
            });
        }, 1000);

        if (apiUrl) {
            return apiUrl;
        } else {
            return API_URL;
        }

    },

    async getRpcUrl() {
        const apiUrl = await api_service.getApiUrl();
        return apiUrl + "/jsonrpc";
    },


    async getAuthUrl() {
        const apiUrl = await api_service.getApiUrl();
        return apiUrl + "/login";
    },

    async getBaseUrl() {
        const apiUrl = await api_service.getApiUrl();
        // http://127.0.0.1:5000/api expected
        return apiUrl.replace('/api', '/');
    },

    async setApiUrl(apiUrl) {
        chrome.storage.local.set({ ['apiUrl']: apiUrl }, function () {
            console.log('ApiUrl stored successfully');
        });
    }
};

