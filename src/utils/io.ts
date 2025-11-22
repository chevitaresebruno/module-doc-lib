import { RenderAble } from "../interfaces/RenderAble";
import { WeightProtocol } from "../interfaces/WeightProtocol";

/**
 * Apply 'tabs' (\t charactere) in 'str' object x 'times'. This 'identate' the 'str' object.
 * @param str the string wanted apply identation
 * @param times how much tabs want to apply
 * @returns the string identated
 */
export function identate(str: string, times: number = 0): string {
    return '\t'.repeat(times) + str;
}

/**
 * Apply 'tabs' (\t charactere) in 'str' objects x 'times'. This 'identate' all strings in 'strs' object and join it. It not modify the original array.
 * @param strs the strings wanted apply identation
 * @param times how much tabs want to apply
 * @param separator the separetor in join statement
 * @returns the string identated and joinned
 * 
 * @example DEFAULT CASE
 * strings_array = ["str_1", "str_2"];
 * times_identate = 2;
 * joinned = identateAndJoin(strings_array, times_identate);
 * // joinned content: "\t\tstr_1\n\t\tstr_2"
 */
export function identateAndJoin(strs: string[], times: number = 0, separator: string = '\n'): string {
    return strs.map(str => identate(str, times)).join(separator);
}

/**
 * Apply 'tabs' (\t charactere) in 'str' objects x 'times'. This 'identate' all strings in 'strs' object and join it. It modify the original array (more economic than identateAndJoin function).
 * @param strs the strings wanted apply identation
 * @param times how much tabs want to apply
 * @param separator the separetor in join statement
 * @returns the string identated and joinned
 * 
 * @example DEFAULT CASE
 * strings_array = ["str_1", "str_2"];
 * times_identate = 2;
 * joinned = identateAndJoin(strings_array, times_identate);
 * // joinned content: "\t\tstr_1\n\t\tstr_2"
 */
export function identateAndJoinInPlace(strs: string[], times: number = 0, separator: string = '\n'): string {
    for(const [index, str] of strs.entries()) {
        strs[index] = identate(str, times);
    }

    return strs.join(separator);
}


export function renderIdentateAndJoin(renders: RenderAble[], times: number = 0, separator: string = '\n'): string {
    const rendered = renders.map(r => r.render());
    
    return identateAndJoinInPlace(rendered, times, separator);
}


export function compareWeightProtocol<T extends WeightProtocol>(objA: T, objB: T): -1 | 0 | 1 {
    const weight_a = objA.weight();
    const weight_b = objB.weight();

    if(weight_a > weight_b) { return 1; }
    if(weight_a < weight_b) { return -1; }
    
    return 0;
}


export function stringFormat(src: string, ...args: (string | number)[]): string {
    let index = 0;

    return src.replaceAll('{}', () => String(args[index++] ?? ""));
}

