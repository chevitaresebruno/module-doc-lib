import { NamespaceRender } from "../../shared/NamespaceRender";

export type LanguageOptions = "python" | "js" | "ts" | "java" | "plantuml"


export class CodeBlockRender extends NamespaceRender {
    private readonly content: string;

    public constructor(language: LanguageOptions, content: string) {
        super(language, '```', '```');
        this.content = content;
    }

    public get Content(): string {
        return this.content;
    }

    public render(): string {
        return `${this.start_block}${this.name}\n${this.Content}\n${this.end_block}`
    }
}

