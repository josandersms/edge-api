export enum VAULT_ENTITY_TYPE {
    CERTIFICATE,
    KEY,
    SECRET
}

export type KeyVaultResponse = {
    attributes: any;
    id: string;
    tags: any;
    value: string;
}