import dns from 'node:dns';
import os from 'node:os';

export const ipv4 = async (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        try {
            dns.lookup(os.hostname(), (lookupError, address) => {
                if (lookupError) {
                    throw(lookupError);
                }
                resolve(address);
            });
        } catch (error) {
            reject(error as Error);
        }
        
    });
    
}