import { CODES } from './enums';

export class SystemError extends Error {
    public code?: CODES

    constructor(code: CODES, message: string) {
        super();
        this.code = code;
        this.message = message;
    }
}