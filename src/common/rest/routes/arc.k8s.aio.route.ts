import { App, Request, Response } from '@tinyhttp/app';
import { CODES } from '~app/common/enums';
import { IRoute, TranslatedHttpError, translateHttpError } from '~app/common/rest';
import { ArcK8sAIOService } from '~app/feature/arc/k8s/aio';
import { KeyVaultService, VAULT_ENTITY_TYPE } from '~app/feature/key-vault';

export class ArcK8sAIORoute implements IRoute {
    public service!: ArcK8sAIOService;

    public constructor (
        private basePath: string = '/arc/k8s/aio'
    ) {
        this.service = new ArcK8sAIOService();
    }

    public applyRoutes(server: App): void {
        server.post(`${this.basePath}`, async (request: Request, response: Response, next: any) => {
            try {
                if (!request.headers.authorization) throw(CODES.EUNAUTHORIZED);
                const token = request.headers.authorization.substring(7, request.headers.authorization.length);
                const keyVaultService = new KeyVaultService();
                request.body.authorization.username = (await keyVaultService.getEntity('arc-connect-sa-account', VAULT_ENTITY_TYPE.SECRET, token, request.body.vaultUri)).value;
                request.body.authorization.secret = (await keyVaultService.getEntity('arc-connect-sa-secret', VAULT_ENTITY_TYPE.SECRET, token, request.body.vaultUri)).value;
                
                // Set some defaults if not provided
                if(!request.body.scaling.brokerBackendPartitions) request.body.scaling.brokerBackendPartitions = 1;
                if(!request.body.scaling.brokerBackendRf) request.body.scaling.brokerBackendRf = 2;
                if(!request.body.scaling.brokerBackendWorkers) request.body.scaling.brokerBackendWorkers = 1;
                if(!request.body.scaling.brokerFrontendReplicas) request.body.scaling.brokerFrontendReplicas = 1;
                if(!request.body.scaling.brokerFrontendWorkers) request.body.scaling.brokerFrontendWorkers = 1;
                if(!request.body.scaling.brokerMemoryProfile) request.body.scaling.brokerMemoryProfile = 'Low';
                const result = await this.service.createEntity(request.body);
                response.send(result);
            } catch (error: any) {
                const translatedHttpError: TranslatedHttpError = translateHttpError(error?.code);
                response.statusCode = translatedHttpError.statusCode;
                response.send({error: translatedHttpError.message});
            }
            next();
        });
    }
}