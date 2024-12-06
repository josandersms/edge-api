import { App, Request, Response } from '@tinyhttp/app';
import { IRoute, TranslatedHttpError, translateHttpError } from '~app/common/rest';

export class HealthRoute implements IRoute {

    public constructor (
        private basePath: string = '/health'
    ) {}

    public applyRoutes(server: App): void {
        server.get(`${this.basePath}`, async (request: Request, response: Response, next: any) => {
            try {
                const result: any = {status: 'Ok'}
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