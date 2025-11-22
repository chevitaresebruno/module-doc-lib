import { describe, it, expect } from 'vitest';
import { SintaxeError } from '../src/errors/SintaxeError';

describe(
    "SintaxeError",
    () =>
    {
        it(
            "returns sintaxe error",
            () =>
            {
                const err = new SintaxeError("message");

                expect(err.message).toBe("INVALID SINTAXE: message");
            }
        )
    }
)