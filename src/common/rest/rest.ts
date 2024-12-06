import { App } from '@tinyhttp/app';
import { CODES } from '~app/common/enums';

export enum HTTP_METHOD {
    ALL,
    DELETE,
    GET,
    PATCH,
    POST,
    PUT
};

export interface IRoute {
    applyRoutes(server: App): void;
}

export class TranslatedHttpError {
    public message: string;
    public statusCode: number;

    public constructor(message: string, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export const translateHttpError = (errorCode: CODES): TranslatedHttpError => {
    let translatedError: TranslatedHttpError;

    switch(errorCode) {
        case CODES.ENOTFOUND:
            translatedError = new TranslatedHttpError('NOT FOUND', 404);
            break;
        case CODES.ECANNOTCREATE, CODES.ECANNOTDELETE, CODES.ECANNOTUPDATE:
            translatedError = new TranslatedHttpError('SERVER ERROR', 501);
            break;
        default:
            translatedError = new TranslatedHttpError('UNKNOWN', 500);
            break;
    }
    return translatedError;
}
