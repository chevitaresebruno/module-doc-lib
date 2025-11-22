import { PlantumlCardinalityOptions, PlantumlNamespaceRelatorVariant, PlantumlSimpleElementVariant, type ClassDiagramNamespaceOptions } from "./types.d";
import { RenderAble } from "../../../../interfaces/RenderAble";
import { WeightProtocol } from "../../../../interfaces/WeightProtocol";
import { compareWeightProtocol, identateAndJoin, stringFormat } from "../../../../utils/io";
import { NamespaceRender } from "../../../shared/NamespaceRender";


export class PlantumlNamespaceRelator implements RenderAble, WeightProtocol {
    private readonly target: PlantumlClassDiagramNamespaceElementRender;

    private readonly variant: PlantumlNamespaceRelatorVariant;
    
    private readonly selfCardinality: PlantumlCardinalityOptions;
    
    private readonly targetCardinality: PlantumlCardinalityOptions;

    private readonly label: string;

    public constructor(target: PlantumlClassDiagramNamespaceElementRender, variant: PlantumlNamespaceRelatorVariant, label: string = '', selfCardinality: PlantumlCardinalityOptions = '', targetCardinality: PlantumlCardinalityOptions = '') {
        this.target = target;
        this.variant = variant;
        this.selfCardinality = selfCardinality;
        this.targetCardinality = targetCardinality;
        this.label = label;
    }

    public render(): string {
        const self_cardinality = this.selfCardinality.length > 0 ? `"${this.selfCardinality}" ` : '';
        const target_cardinality = this.targetCardinality.length > 0 ? ` "${this.targetCardinality}"` : '';
        const label = this.label.length > 0 ? ` : "${this.label}"` : '';

        return `${this.target.Name}${target_cardinality}${this.variant}${self_cardinality}{}${label}`;
    }

    weight(): -2 | -1 | 0 | 1 | 2 {
        switch(this.variant) {
            case PlantumlNamespaceRelatorVariant.EXTENSION: return -2;
            case PlantumlNamespaceRelatorVariant.IMPLEMENTATION: return -1;
            case PlantumlNamespaceRelatorVariant.SIMPLE_RELATION: return 0;
            case PlantumlNamespaceRelatorVariant.COMPOSITION: return 1;
            case PlantumlNamespaceRelatorVariant.AGGREGATION: return 2;
        }
    }
}

export class PlantumlClassDiagramNamespaceElementRender extends NamespaceRender {
    private readonly namesapceOption: ClassDiagramNamespaceOptions;
    
    protected content: string;

    private readonly relations: Array<PlantumlNamespaceRelator>;

    public constructor(namespaceName: string, namespaceOption: ClassDiagramNamespaceOptions, content: string) {
        super(namespaceName, "{", "}");
        this.namesapceOption = namespaceOption;
        this.content = content;
        this.relations = new Array<PlantumlNamespaceRelator>();
    }

    public addRelation(relator: PlantumlNamespaceRelator): void {
        this.relations.push(relator);
    }

    public addSimpleRelation(targer: PlantumlClassDiagramNamespaceElementRender, selfCardinality: PlantumlCardinalityOptions = '', targetCardinality: PlantumlCardinalityOptions = '', label: string = ''): PlantumlNamespaceRelator {
        const relation = new PlantumlNamespaceRelator(targer, PlantumlNamespaceRelatorVariant.SIMPLE_RELATION, label, selfCardinality, targetCardinality);
        this.addRelation(relation);
        
        return relation;
    }

    get Content(): string {
        return this.content;
    }

    override get Name(): string {
        if (this.name.includes(' ')) {
            return `"${this.name}"`;
        }
        
        return this.name;
    }

    protected getDeclaration(): string {
        return this.Name;
    }

    private sortRelations(): void {
        this.relations.sort(compareWeightProtocol);
    }

    public renderRelations(): string {
        this.sortRelations();

        return identateAndJoin(this.relations.map(relation => stringFormat(relation.render(), this.Name)), 1);
    }

    public render(): string {
        return `${this.namesapceOption} ${this.getDeclaration()} ${this.start_block}\n${this.Content}\n${this.end_block}`;
    }
}

export class PlnatumlSpecifSpotNamespace extends PlantumlClassDiagramNamespaceElementRender {
    private readonly leter: string;

    private readonly color: string;
    
    private readonly stereotype: string;

    public constructor(namespaceName: string, namespaceOption: ClassDiagramNamespaceOptions, content: string, leter: string, color: string, stereotype: string) {
        super(namespaceName, namespaceOption, content);
        this.leter = leter;
        this.color = color;
        this.stereotype = stereotype;
    }

    protected override getDeclaration(): string {
        return `${this.name} << (${this.leter},${this.color}) ${this.stereotype} >>`;
    }
}

export class PlantumlSimpleElementRender implements RenderAble {
    private readonly variant: PlantumlSimpleElementVariant;

    private readonly label: string;
    
    public constructor(variant: PlantumlSimpleElementVariant, label: string = '') {
        this.variant = variant;
        this.label = label;
    }

    public render(): string {
        return `${this.variant} ${this.label}`;
    }
}

