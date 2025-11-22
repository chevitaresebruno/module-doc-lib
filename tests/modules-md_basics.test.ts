import { describe, it, expect } from 'vitest';

import { CodeBlockRender } from '../src/modules/md/basics/CodeBlockRender';
import { expectTextToBe } from './utils';


describe(
    "Code Block Render",
    () =>
    {
        it(
            'render some codeblock',
            () =>
            {
                const python_block = new CodeBlockRender("python", "def hello(name: str):\n\tprint(f'Hello {name}!')");
                expectTextToBe(python_block.render(), 'python_block.md');
                const plantuml_block = new CodeBlockRender("plantuml", "@startuml\nabstract myclass\n@enduml");
                expectTextToBe(plantuml_block.render(), 'plantuml_block.md');
                expect(python_block.Name).toBe("python");
                expect(python_block.Content).toBe("def hello(name: str):\n\tprint(f'Hello {name}!')");
            }
        )
    }
)

