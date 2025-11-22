import { PlantumlRender } from "./PlantumlRender";
import { BuilderProtocol } from "../../../interfaces/BuilderProtocol";
import { RenderAble } from "../../../interfaces/RenderAble";
import { identateAndJoin, identateAndJoinInPlace } from "../../../utils/io";


export class PlantumlBuilder implements BuilderProtocol<PlantumlRender> {
    private readonly content = new Array<string>();

    public add(content: string): void {
        this.content.push(content);
    }

    public addObj(renderable: RenderAble): void {
        const rendered = renderable.render().split('\n');
        for(const line of rendered) {
            this.content.push(line);
        }
    }

    public addBlankLine(): void {
        if (this.content.length == 0) {
            this.content.push('\n');
        } else {
            this.content.push('');
        }
    }

    public build(): PlantumlRender {
        return new PlantumlRender(identateAndJoin(this.content, 1));
    }

    // works only once time
    public buildInPlace(): PlantumlRender {
        return new PlantumlRender(identateAndJoinInPlace(this.content, 1));
    }
}

