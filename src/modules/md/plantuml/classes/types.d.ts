export type SemanticOptions = "enum" | "interface";

export type TypeLikeOptions = "class" | "entity" | "abstract class" | "abstract";

export type ClassDiagramNamespaceOptions = SemanticOptions | TypeLikeOptions;

export type PlantumlCardinalityOptions = '0' | '1' | '*' | '0..1' | '0..*' | '1..*' | '';

export type CommumTypes = 'string' | 'String' | 'date' | 'datetime' | 'duration' | 'point' | 'integer' | 'decimal' | 'uid' | 'PhoneNumber' | 'CPF' | 'CNPJ' | 'Adrress' | 'float' | 'double' | 'bytes' | 'void' | ''; 

export type MethodVariant = '' | '{static}' | '{abstract}';

export enum PlantumlSimpleElementVariant {
    CIRCLE = 'circle',
    CIRCLE_SHORT_FORM = '()',
    DIAMOND = 'diamond',
    DIAMOND_SHOR_FORM = '<>'
}

export enum PlantumlNamespaceRelatorVariant {
    EXTENSION = '<|--',
    IMPLEMENTATION = '<|..',
    SIMPLE_RELATION = '--',
    COMPOSITION = '*--',
    AGGREGATION = 'o--'
}

export enum PlantumlModifiers {
    DEFAULT = '',
    PUBLIC = '+',
    PRIVATE = '-',
    PROTECTED = '*'
}

export interface PlantumlParamType {
    name: string;
    varType?: CommumTypes;
}

export interface PlantumlVariableType extends PlantumlParamType {
    varModifier: PlantumlModifiers;
}


export interface PlantumlMethodType {
    name: string;
    params: PlantumlParamType[];
    returnType?: string;
    variant: MethodVariant;
    modifier: PlantumlModifiers;
}