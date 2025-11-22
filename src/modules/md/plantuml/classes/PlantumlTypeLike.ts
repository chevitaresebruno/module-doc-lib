import { PlantumlClassDiagramNamespaceElementRender, PlantumlNamespaceRelator } from "./PlantumlElementRender";
import { CommumTypes, PlantumlModifiers, PlantumlNamespaceRelatorVariant, PlantumlParamType, type PlantumlMethodType, type TypeLikeOptions } from "./types.d"
import { PlantumlMethodRender, PlantumlVariableRender } from "./utils";
import { SintaxeError } from "../../../../errors/SintaxeError";
import { compareWeightProtocol, identateAndJoinInPlace, renderIdentateAndJoin } from "../../../../utils/io";


export class PlantumlInterfaceRender extends PlantumlClassDiagramNamespaceElementRender {
    private readonly methods: Array<PlantumlMethodRender>;

    public constructor(name: string) {
        super(name, "interface", "");
        this.methods = new Array<PlantumlMethodRender>;
    }

    public addMethod(name: string, params: PlantumlParamType[] = [], returnType: CommumTypes = 'void'): void {
        const method_render = new PlantumlMethodRender(name, returnType, '{abstract}');
        for(const p of params) {
            method_render.addParam(p.name, p.varType);
        }
        this.methods.push(method_render);
    }

    public extends(plantumlInterface: PlantumlInterfaceRender): void {
        const relator = new PlantumlNamespaceRelator(plantumlInterface, PlantumlNamespaceRelatorVariant.EXTENSION);
        this.addRelation(relator);
    }

    override get Content(): string {
        const rendered_methods = this.methods.map(method => method.render());

        return identateAndJoinInPlace(rendered_methods, 1);
    }
}

export class PlantumlBaseClassRender extends PlantumlClassDiagramNamespaceElementRender {
    private readonly properties: Array<PlantumlVariableRender>;
    
    protected readonly methods: Array<PlantumlMethodRender>;

    public constructor(name: string, variant: TypeLikeOptions = 'class') {
        super(name, variant, "");
        this.properties = new Array<PlantumlVariableRender>();
        this.methods = new Array<PlantumlMethodRender>();
    }

    /**
     * This method is used to add an PlantumlMethodRender objects.
     * It is util to add your own custtom methods that extends the PlantumlMethodRender.
     * @param method The method wanted to add.
     */
    public addMethodObj(method: PlantumlMethodRender): void {
        this.methods.push(method);
    }

    protected addMethod(method: PlantumlMethodType): void {
        const new_method = new PlantumlMethodRender(method.name, method.returnType as CommumTypes, method.variant, method.modifier);
        for(const param of method.params) {
            new_method.addParam(param.name, param.varType);
        }
        this.methods.push(new_method);
    }

    public addConcreteMethod(name: string, params?: PlantumlParamType[], returnType?: string, modifier: PlantumlModifiers = PlantumlModifiers.DEFAULT): void {
        this.addMethod(
            {
                name: name,
                params: params??new Array<PlantumlParamType>(),
                returnType: returnType,
                variant: '',
                modifier: modifier 
            }
        );
    }

    public addStaticMethod(name: string, params?: PlantumlParamType[], returnType?: string, modifier: PlantumlModifiers = PlantumlModifiers.DEFAULT): void {
        this.addMethod(
            {
                name: name,
                params: params??new Array<PlantumlParamType>(),
                returnType: returnType,
                variant: '{static}',
                modifier: modifier
            }
        );
    }

    public addProperty(name: string, varType: CommumTypes, modifier: PlantumlModifiers = PlantumlModifiers.DEFAULT): void {
        this.properties.push(new PlantumlVariableRender(name, varType, modifier));
    }

    public implements(plantumlInterface: PlantumlInterfaceRender): void {
        const relator = new PlantumlNamespaceRelator(plantumlInterface, PlantumlNamespaceRelatorVariant.IMPLEMENTATION);
        this.addRelation(relator);
    }

    public extends(plantumlClass: PlantumlBaseClassRender): void {
        const relator = new PlantumlNamespaceRelator(plantumlClass, PlantumlNamespaceRelatorVariant.EXTENSION);
        this.addRelation(relator);
    }

    override get Content(): string {
        const properties = renderIdentateAndJoin(this.properties, 1);
        const properties_mask = properties.length > 0 ? `${properties}` : ``;
        const methods = properties_mask.length > 0 ? `\n${renderIdentateAndJoin(this.methods, 1)}` : renderIdentateAndJoin(this.methods, 1);

        return `${properties_mask}${methods}`;
    }

    private sortMethods(): void {
        this.methods.sort(compareWeightProtocol);
    }

    /**
     * This method renders a class as the plantuml expect.
     * This method sort all internal methods before run.
     * By default, the methods order is: concrete methods, abstract methods and concrete methods.
     * To change this order, you should create your own method classes that extends the PlantumlClassRender, override the weight method and add it instances by method addMethodObj.
     * @returns a string of the object rendered as espected for PlantumlClass namespace
     */
    public render(): string {
        this.sortMethods();

        return super.render();
    }
}

export class PlantumlConcreteClassRender extends PlantumlBaseClassRender {
    public constructor(name: string) {
        super(name, "class")
    }
    
    /**
     * This method checks if a passed "method" is valid for concrete class. A concrete class can't have an abstract method.
     * @param method the method you want validate
     * @throws SintaxeError if the method is abstract
     */
    private static validateClassMethod(method: PlantumlMethodRender):void {
        if(method.isAbstract()) {
            throw new SintaxeError(`plantuml class can't have abstract method ${method.render()}`);
        }
    }

    protected validate(): void {
        for(const method of this.methods) {
            PlantumlConcreteClassRender.validateClassMethod(method);
        }
    }

    /**
     * This method renders a class as the plantuml expect.
     * This method sort all internal methods before run.
     * By default, the methods order is: concrete methods, abstract methods and concrete methods.
     * To change this order, you should create your own method classes that extends the PlantumlClassRender, override the weight method and add it instances by method addMethodObj.
     * @returns a string of the object rendered as espected for PlantumlClass namespace
     */
    public render(): string {
        this.validate();

        return super.render();
    }
}

export class PlantumlAbstractClassRender extends PlantumlBaseClassRender {
    public constructor(name: string) {
        super(name, "abstract");
    }

    public addAbstractMethod(name: string, params?: PlantumlParamType[], returnType?: string): void {
        this.addMethod(
            {
                name: name,
                params: params??new Array<PlantumlParamType>(),
                returnType: returnType,
                variant: '{abstract}',
                modifier: PlantumlModifiers.PUBLIC
            }
        );
    }
}
