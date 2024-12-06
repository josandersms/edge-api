import { KeyVaultResponse, VAULT_ENTITY_TYPE } from './key-vault';
import { httpClient } from '~app/common/http-client';

export class KeyVaultService {
    public ready: Promise<any>;

    public constructor() {
        this.ready = new Promise(async (resolve, reject) => {
            try {
                // Perform additional steps here as necessary to initialize the service, then resolve
                resolve(undefined);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    public async getEntity(entityName: string, entityType: VAULT_ENTITY_TYPE, oAuthToken: string, vaultUri: string, apiVersion?: string): Promise<KeyVaultResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const entityPath: string = entityType === VAULT_ENTITY_TYPE.CERTIFICATE ? 'certificates' : entityType === VAULT_ENTITY_TYPE.KEY ? 'keys' : 'secrets';
                resolve(JSON.parse(await httpClient(`${vaultUri}/${entityPath}/${entityName}/${apiVersion ? '?api-version=' + apiVersion : ''}`, 'GET', oAuthToken, true)));
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }
}