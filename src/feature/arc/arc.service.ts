import { IArcConnectionProperties, IArcDisconnectionProperties } from './arc';
import { execSync } from 'child_process';

export class ArcService {
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

    public async createEntity(entity: IArcConnectionProperties): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const command = `sudo azcmagent connect --resource-group ${entity.resourceGroup} --tenant-id ${entity.tenant} --subscription-id ${entity.subscription} --location ${entity.location} --cloud ${entity.cloud} --service-principal-id ${entity.authorization.username} --service-principal-secret ${entity.authorization.secret}` + entity.deviceName ? ` --resource-name ${entity.deviceName}` : `` + ` --verbose`;
                execSync(command);
                resolve({status: "Ok"});
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    public async deleteEntity(entity: IArcDisconnectionProperties): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const command = `sudo azcmagent disconnect --service-principal-id ${entity.authorization.username} --service-principal-secret ${entity.authorization.secret} --verbose`;
                execSync(command);
                resolve({status: "Ok"});
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }
}