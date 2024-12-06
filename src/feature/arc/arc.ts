export interface IArcConnectionProperties {
    authorization: {
        secret: string;
        username: string;
    };
    cloud: 'AzureCloud' | 'AzureUSGovernment' | 'AzureChinaCooud';
    deviceName?: string;
    location: string;
    resourceGroup: string;
    subscription: string;
    tenant: string;
}

export interface IArcDisconnectionProperties {
    authorization: {
        secret: string;
        username: string;
    }
}
