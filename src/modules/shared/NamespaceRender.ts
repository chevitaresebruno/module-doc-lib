import { RenderAble } from "../../interfaces/RenderAble";

export abstract class NamespaceRender implements RenderAble {
    protected readonly name: string;

    protected readonly start_block: string;

    protected readonly end_block: string;

    public constructor(name: string, startBlok: string, endBlock: string) {
        this.name = name;
        this.start_block = startBlok;
        this.end_block = endBlock;
    }

    public get Name(): string {
        return this.name;
    }

    abstract render(): string;
}

