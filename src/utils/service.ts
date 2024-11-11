import dotenv from "dotenv";

if (process.platform === "win32" || process.env.NODE_ENV === "development") {
    dotenv.config({path: "./.env.development"});
}

export const imgurApi = (endpoint: string, method: 'POST' | 'GET', data?: any): Promise<Response> => {
    const headers: Record<string, string> = {
        'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`
    };
    
    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        data = JSON.stringify(data);
    }

    return fetch(`https://api.imgur.com/3/${endpoint}`, {
        method: method,
        headers,
        body: data
    });
};
