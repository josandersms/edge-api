export interface IArcK8sAIOConnectionProperties {
    aioName: string;
    authorization: {
        secret: string;
        username: string;
    };
    clusterName: string;
    customLocationName: string;
    location: string;
    resourceGroup: string;
    scaling: {
        brokerBackendPartitions: number;
        brokerBackendRf: number;
        brokerBackendWorkers: number;
        brokerFrontendReplicas: number;
        brokerFrontendWorkers: number;
        brokerMemoryProfile: string;
    };
    schemaRegistry: string;
    schemaRegistryResourceGroup: string;
    schemaRegistrySubscription: string;
    subscription: string;
    tenant: string;
}