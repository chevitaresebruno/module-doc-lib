import { describe, it, expect } from 'vitest';
import { compareWeightProtocol, identate, identateAndJoin, identateAndJoinInPlace, renderIdentateAndJoin, stringFormat } from '../src/utils/io';
import { RenderAble } from '../src/interfaces/RenderAble';
import { WeightProtocol } from '../src/interfaces/WeightProtocol';


class SimpleRender implements RenderAble {
    render(): string {
        return 'SimpleRender';
    }
}

describe(
    'Identators',
    () =>
    {
        it(
            'identate some text',
            () =>
            {
                expect(identateAndJoin([])).toBe('');
                expect(identateAndJoinInPlace([])).toBe('');
                expect(renderIdentateAndJoin([])).toBe('');
                
                const grettings = 'Hi {}, {}!';
                expect(stringFormat(grettings, 'someone', 'nice to meet you')).toBe("Hi someone, nice to meet you!");
                expect(stringFormat(grettings)).toBe('Hi , !');
                expect(grettings).toBe('Hi {}, {}!');

                expect(identate('string')).toBe('string');
                expect(identate('string', 1)).toBe('\tstring');
                expect(identate('string', 2)).toBe('\t\tstring');

                const original = ['string1', 'string2'];
                expect(identateAndJoin(original, 1)).toBe('\tstring1\n\tstring2');
                expect(original.at(0)).toBe('string1');
                expect(original.at(1)).toBe('string2');

                expect(identateAndJoinInPlace(original, 1)).toBe('\tstring1\n\tstring2');
                expect(original.at(0)).toBe('\tstring1');
                expect(original.at(1)).toBe('\tstring2');

                const renders_array = [new SimpleRender(), new SimpleRender()];

                expect(renderIdentateAndJoin(renders_array, 1)).toBe('\tSimpleRender\n\tSimpleRender');
            }
        )
    }
)

class SimpleFixedWeight implements WeightProtocol {
    weight(): -1 | 0 | 1  {
        return 0;
    }
}

class SimpleLowWeight implements WeightProtocol {
    weight(): -1 | 0 | 1  {
        return -1;
    }
}

class SimpleHeavyWeight implements WeightProtocol {
    weight(): -1 | 0 | 1  {
        return 1;
    }
}

describe(
    'WeightProtocolTester',
    () =>
    {
        it(
            "sort an weight array",
            () =>
            {
                const weight_arr = [new SimpleHeavyWeight(), new SimpleLowWeight(), new SimpleFixedWeight()];
                weight_arr.sort(compareWeightProtocol);
                expect(compareWeightProtocol(weight_arr[0], weight_arr[1])).toBe(-1);
                expect(compareWeightProtocol(weight_arr[1], weight_arr[2])).toBe(-1);
                expect(compareWeightProtocol(weight_arr[0], weight_arr[2])).toBe(-1);
                expect(compareWeightProtocol(weight_arr[0], weight_arr[0])).toBe(0);
                expect(compareWeightProtocol(weight_arr[1], weight_arr[0])).toBe(1);
            }
        )
    }
)
