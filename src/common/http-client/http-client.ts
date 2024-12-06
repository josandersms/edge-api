import * as https from 'node:https';
import * as http from 'node:http';

export const httpClient = async <T>(uri: string, method: string, token?: string, secure: boolean = true): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            const headers: http.OutgoingHttpHeaders = {};
            headers.accept = 'application/json, text/plain, */*';

            if (token) headers.authorization = `Bearer ${token}`;

            if (secure) {
                const request = https.request(uri, {
                    headers,
                    method
                }, async (result) => {
                    resolve(await resultHandler(result));
                });
                request.on('error', (error) => {
                    console.error(error);
                    reject(error);
                });
                request.end();
            } else {
                const request = http.request(uri, {
                    headers,
                    method
                }, async (result) => {
                    resolve(await resultHandler(result));
                });
                request.on('error', (error) => {
                    console.error(error);
                    reject(error);
                });
                request.end();
            }
            
        } catch (error) {
            reject(error);
        }
    });
}

const resultHandler = async <T>(result: http.IncomingMessage): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        let data: string = '';
        result.on('error', (e) => {
            console.error(e);
            reject(e);
        });
        result.on('data', (chunk) => {
            data += chunk;
        });
        result.on('end', () => {
            resolve(data as T);
        });
    });
};