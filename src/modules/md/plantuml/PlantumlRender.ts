import { CodeBlockRender } from "../basics/CodeBlockRender";

export class PlantumlRender extends CodeBlockRender {
    public constructor(content: string) {
        super("plantuml", content);
    }
    
    override get Content(): string {
        const content = super.Content;
        const start_block = '@startuml';
        const end_block = '@enduml';

        return `${start_block}\n${content}\n${end_block}`;
    }
}

