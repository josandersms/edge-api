export interface IArcK8sConnectionProperties {
    authorization: {
        secret: string;
        username: string;
    };
    clusterName: string;
    location: string;
    resourceGroup: string;
    subscription: string;
    tenant: string;
}

export interface IArcK8sDisconnectionProperties {
    authorization: {
        secret: string;
        username: string;
    };
    clusterName: string;
    resourceGroup: string;
    subscription: string;
    tenant: string;
}