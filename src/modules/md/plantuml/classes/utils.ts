import { CommumTypes, PlantumlModifiers, type MethodVariant } from "./types.d";
import { RenderAble } from "../../../../interfaces/RenderAble";
import { WeightProtocol } from "../../../../interfaces/WeightProtocol";

export class PlantumlVariableRender implements RenderAble {
    private readonly name: string;

    private readonly varType: string;

    private readonly varModifier: PlantumlModifiers;

    public constructor(name: string, varType: CommumTypes = '', varModifier: PlantumlModifiers = PlantumlModifiers.DEFAULT) {
        this.name = name;
        this.varType = varType;
        this.varModifier = varModifier;
    }

    public render(): string {
        const modifier = this.varModifier ? `${this.varModifier} ` : '';

        if(this.varType.length > 0) {
            return `${modifier}${this.name}: ${this.varType}`;
        }

        return `${modifier}${this.name}`;
    }
}

export class PlantumlMethodRender implements RenderAble, WeightProtocol {
    private readonly name: string;

    private readonly params: Array<PlantumlVariableRender>;

    private readonly returnType?: string;

    private readonly variant: MethodVariant;

    private readonly modifier: PlantumlModifiers;
    
    public constructor(name: string, returnType: CommumTypes = 'void', variant: MethodVariant = '', modifier: PlantumlModifiers = PlantumlModifiers.DEFAULT) {
        this.name = name;
        this.params = new Array<PlantumlVariableRender>();
        this.returnType = returnType;
        this.variant = variant;
        this.modifier = modifier;
    }

    public addParam(name: string, paramType?: CommumTypes): void {
        this.params.push(new PlantumlVariableRender(name, paramType));
    }

    private renderParams(): string {
        return this.params.map(param => param.render()).join(', ');
    }

    public render(): string {
        const variant_mask = this.modifier == PlantumlModifiers.DEFAULT ? '' : `${this.modifier} `;
        const return_type = this.returnType ? `${this.returnType} ` : '';
        const variant = this.variant.length > 0 ? `${this.variant} ` : '';
        
        return `${variant_mask}${variant}${return_type}${this.name}(${this.renderParams()})`;
    }

    public isConcrete(): boolean {
        return this.variant === '';
    }

    public isAbstract(): boolean {
        return this.variant === '{abstract}';
    }

    public isStatic(): boolean {
        return this.variant === '{static}';
    }

    public weight(): -2 | -1 | 0 | 1 {
        switch(this.variant) {
            case '': return -1;
            case '{abstract}': return 0;
            case '{static}': return 1;
        }
    }
}

