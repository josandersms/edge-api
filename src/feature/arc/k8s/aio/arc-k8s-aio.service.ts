import { IArcK8sAIOConnectionProperties } from './arc-k8s-aio';
import { execSync } from 'child_process';
import { environment } from '~app/environment';

export class ArcK8sAIOService {
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

    public async createEntity(entity: IArcK8sAIOConnectionProperties): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                execSync(`az login --service-principal --username ${entity.authorization.username} --password ${entity.authorization.secret} --tenant ${entity.tenant}`);
                const azK8sIssuer = execSync(`az connectedK8s show --resource-group ${entity.resourceGroup} --name ${entity.clusterName} --query oidcIssuerProfile.issuerUrl --output tsv`).toString().trim();
                execSync(`sudo echo 'kube-apiserver-arg:\n - service-account-issuer=${azK8sIssuer}\n - service-account-max-token-expiration=24h\n' > /etc/rancher/k3s/config.yaml`);
                const arcEntraId = execSync('az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv').toString().trim();
                execSync(`az connectedk8s enable-features --kube-config "${environment.kubeconfigLocation}" -n ${entity.clusterName} -g ${entity.resourceGroup} --custom-locations-oid ${arcEntraId} --features cluster-connect custom-locations`);
                execSync(`systemctl restart k3s`);
                execSync(`az iot ops init --subscription ${entity.subscription} -g ${entity.resourceGroup} --cluster ${entity.clusterName}`);
                execSync(`az iot ops create --subscription ${entity.subscription} -g ${entity.resourceGroup} --cluster ${entity.clusterName} --custom-location ${entity.customLocationName} -n ${entity.aioName} --sr-resource-id /subscriptions/${entity.schemaRegistrySubscription}/resourceGroups/${entity.schemaRegistryResourceGroup}/providers/Microsoft.DeviceRegistry/schemaRegistries/${entity.schemaRegistry} --broker-frontend-replicas ${entity.scaling.brokerFrontendReplicas} --broker-frontend-workers ${entity.scaling.brokerFrontendWorkers} --broker-backend-part ${entity.scaling.brokerBackendPartitions} --broker-backend-workers ${entity.scaling.brokerBackendWorkers} --broker-backend-rf ${entity.scaling.brokerBackendRf} --broker-mem-profile ${entity.scaling.brokerMemoryProfile}}`);
                resolve({status: "Ok"});
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

}
            