import { App, Request, Response } from '@tinyhttp/app';
import { CODES } from '~app/common/enums';
import { IRoute, TranslatedHttpError, translateHttpError } from '~app/common/rest';
import { ArcK8sService, IArcK8sDisconnectionProperties } from '~app/feature/arc/k8s';
import { KeyVaultService, VAULT_ENTITY_TYPE } from '~app/feature/key-vault';

export class ArcK8sRoute implements IRoute {
    public service!: ArcK8sService;

    public constructor (
        private basePath: string = '/arc/k8s'
    ) {
        this.service = new ArcK8sService();
    }

    public applyRoutes(server: App): void {
        server.delete(`${this.basePath}/:identifier`, async (request: Request, response: Response, next: any) => {
            try {
                if (!request.headers.authorization) throw(CODES.EUNAUTHORIZED);
                const token = request.headers.authorization.substring(7, request.headers.authorization.length);
                const keyVaultService = new KeyVaultService();
                const requestBody: IArcK8sDisconnectionProperties = {
                    authorization: {
                        secret: (await keyVaultService.getEntity('arc-connect-sa-secret', VAULT_ENTITY_TYPE.SECRET, token, request.query['vaultUri']!.toString())).value,
                        username: (await keyVaultService.getEntity('arc-connect-sa-account', VAULT_ENTITY_TYPE.SECRET, token, request.query['vaultUri']!.toString())).value
                    },
                    clusterName: request.query['clusterName']!.toString(),
                    resourceGroup: request.query['resourceGroup']!.toString(),
                    subscription: request.query['subscription']!.toString(),
                    tenant: request.query['tenant']!.toString()
                }
                const result: any = await this.service.deleteEntity(requestBody);
                response.send({status: 'OK', value: result});
            } catch (error: any) {
                const translatedHttpError: TranslatedHttpError = translateHttpError(error?.code);
                response.statusCode = translatedHttpError.statusCode;
                response.send({error: translatedHttpError.message});
            }
            next();
        });

        // server.get(`${this.basePath}`, async (request: Request, response: Response, next: Function) => {
        //     try {
        //         const result: any = await this.service.getEntities();
        //         response.send(result);
        //     } catch (error: any) {
        //         const translatedHttpError: TranslatedHttpError = translateHttpError(error?.code);
        //         response.statusCode = translatedHttpError.statusCode;
        //         response.send({error: translatedHttpError.message});
        //     }
        //     next();
        // });

        // server.get(`${this.basePath}/:identifier`, async (request: Request, response: Response, next: Function) => {
        //     try {
        //         const result: any = await this.service.getEntity(request.params['identifier']);
        //         response.send(result);
        //     } catch (error: any) {
        //         const translatedHttpError: TranslatedHttpError = translateHttpError(error?.code);
        //         response.statusCode = translatedHttpError.statusCode;
        //         response.send({error: translatedHttpError.message});
        //     }
        //     next();
        // });

        // server.patch(`${this.basePath}/:identifier`, async (request: Request, response: Response, next: Function) => {
        //     try {
        //         const result = await this.service.updateEntity(request.params['identifier'], request.body);
        //         response.send(result);
        //     } catch (error: any) {
        //         const translatedHttpError: TranslatedHttpError = translateHttpError(error?.code);
        //         response.statusCode = translatedHttpError.statusCode;
        //         response.send({error: translatedHttpError.message});
        //     }
        //     next();
        // });

        server.post(`${this.basePath}`, async (request: Request, response: Response, next: any) => {
            try {
                if (!request.headers.authorization) throw(CODES.EUNAUTHORIZED);
                const token = request.headers.authorization.substring(7, request.headers.authorization.length);
                const keyVaultService = new KeyVaultService();
                request.body.authorization.username = (await keyVaultService.getEntity('arc-connect-sa-account', VAULT_ENTITY_TYPE.SECRET, token, request.body.vaultUri)).value;
                request.body.authorization.secret = (await keyVaultService.getEntity('arc-connect-sa-secret', VAULT_ENTITY_TYPE.SECRET, token, request.body.vaultUri)).value;
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