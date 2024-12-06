import { IArcK8sConnectionProperties, IArcK8sDisconnectionProperties } from './arc-k8s';
import { execSync } from 'child_process';
import { environment } from '~app/environment';

export class ArcK8sService {
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

    public async createEntity(entity: IArcK8sConnectionProperties): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                execSync(`az login --service-principal --username ${entity.authorization.username} --password ${entity.authorization.secret} --tenant ${entity.tenant}`);
                execSync(`az config set extension.use_dynamic_install=yes_without_prompt && az extension add --upgrade --name k8s-configuration && az extension add --upgrade --name k8s-extension && az extension add --upgrade --name azure-iot-ops`);
                execSync(`az connectedk8s connect --kube-config "${environment.kubeconfigLocation}" --name ${entity.clusterName} -l ${entity.location} --resource-group ${entity.resourceGroup} --subscription ${entity.subscription} --enable-oidc-issuer --enable-workload-identity`).toString();
                resolve({status: "Ok"});
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    public async deleteEntity(entity: IArcK8sDisconnectionProperties): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                execSync(`az login --service-principal --username ${entity.authorization.username} --password ${entity.authorization.secret} --tenant ${entity.tenant}`).toString();
                execSync(`az connectedk8s delete --kube-config "${environment.kubeconfigLocation}" --name ${entity.clusterName} --resource-group ${entity.resourceGroup} --subscription ${entity.subscription} --yes`).toString();
                resolve({status: "Ok"});
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }
}
            