import { BaseError } from "./BaseError";

export class SintaxeError extends BaseError {
    public constructor(message: string) {
        super(`INVALID SINTAXE: ${message}`);
    }
}

