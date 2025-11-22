import { describe, it, expect } from 'vitest';
import { PlantumlRender } from '../src/modules/md/plantuml/PlantumlRender';
import { PlantumlBuilder } from '../src/modules/md/plantuml/PlantumlBuilder';
import { PlantumlMethodRender, PlantumlVariableRender } from '../src/modules/md/plantuml/classes/utils';
import { expectTextToBe } from './utils';
import { PlantumlModifiers, PlantumlNamespaceRelatorVariant, PlantumlSimpleElementVariant } from '../src/modules/md/plantuml/classes/types.d';
import { PlantumlAbstractClassRender, PlantumlBaseClassRender, PlantumlConcreteClassRender, PlantumlInterfaceRender } from '../src/modules/md/plantuml/classes/PlantumlTypeLike'
import { PlantumlClassDiagramNamespaceElementRender, PlantumlNamespaceRelator, PlantumlSimpleElementRender, PlnatumlSpecifSpotNamespace } from '../src/modules/md/plantuml/classes/PlantumlElementRender';
import { compareWeightProtocol } from '../src/utils/io';
import { SintaxeError } from '../src/errors/SintaxeError';


describe(
    "Plantuml Renders",
    () =>
    {
        it(
            "Should render multiple plantuml types",
            () =>
            {
                const plant_render = new PlantumlRender("abstract myclass");
                expectTextToBe(plant_render.render(), 'plantuml_block.md');
                
                const plant_builder = new PlantumlBuilder();
                plant_builder.add("abstract myclass");
                plant_builder.add('class "some class"');
                plant_builder.add('class OtherClass');
                plant_builder.add('myclass <|-- "some class"');
                plant_builder.add('OtherClass "*"--"1" "some class": "relation name"');


                const plantuml_render_builded = plant_builder.build();
                const plantuml_render_builded_in_place = plant_builder.buildInPlace();

                expectTextToBe(plantuml_render_builded.render(), 'plantuml_great_block.md');
                expectTextToBe(plantuml_render_builded_in_place.render(), 'plantuml_great_block.md');

                // When builderInPlace runs it modify the original array;
                // In operation identateAndJoinInPlace it will identate the original
                // array and modify it with the identated part.
                // So, it expect the same content, but with double identation
                expect(plant_builder.build().render()).toBe('```plantuml\n@startuml\n\t\tabstract myclass\n\t\tclass "some class"\n\t\tclass OtherClass\n\t\tmyclass <|-- "some class"\n\t\tOtherClass "*"--"1" "some class": "relation name"\n@enduml\n```')

                const blankline_tester = new PlantumlBuilder();
                blankline_tester.addBlankLine();
                expect(blankline_tester.build().render()).toBe('```plantuml\n@startuml\n\t\n\n@enduml\n```')

                blankline_tester.add("abstract myclass");
                blankline_tester.addBlankLine();
                expect(blankline_tester.build().render()).toBe('```plantuml\n@startuml\n\t\n\n\tabstract myclass\n\t\n@enduml\n```')

                const ohter_plant_builder = new PlantumlBuilder();
                ohter_plant_builder.addObj(new PlantumlClassDiagramNamespaceElementRender("myclass", "abstract", ""));
                expectTextToBe(ohter_plant_builder.build().render(), 'plantuml_simple_block.md');
            }
        )
    }
)

function testUtils() {
    const some_var = new PlantumlVariableRender("some_var", "string", PlantumlModifiers.PRIVATE);
    expect(some_var.render()).toBe("- some_var: string");

    const method1 = new PlantumlMethodRender("method_1");
    expect(method1.render()).toBe("void method_1()");

    const method2 = new PlantumlMethodRender("method_2", "integer", "{abstract}", PlantumlModifiers.PUBLIC);
    expect(method2.render()).toBe("+ {abstract} integer method_2()");
    method2.addParam("some_param", "integer");
    expect(method2.render()).toBe("+ {abstract} integer method_2(some_param: integer)");
    method2.addParam("other_param", "string");
    expect(method2.render()).toBe("+ {abstract} integer method_2(some_param: integer, other_param: string)");

    const method3 = new PlantumlMethodRender("static_method", "void", "{static}");
    expect(method3.render()).toBe('{static} void static_method()');

    expect(method1.isConcrete()).toBe(true);
    expect(method2.isConcrete()).toBe(false);
    expect(method3.isConcrete()).toBe(false);

    expect(method1.isAbstract()).toBe(false);
    expect(method2.isAbstract()).toBe(true);
    expect(method3.isAbstract()).toBe(false);

    expect(method1.isStatic()).toBe(false);
    expect(method2.isStatic()).toBe(false);
    expect(method3.isStatic()).toBe(true);


    expect(method1.weight()).toBe(-1);
    expect(method2.weight()).toBe(0);
    expect(method3.weight()).toBe(1);

    const method4 = new PlantumlMethodRender("method", "");
    expect(method4.render()).toBe("method()");
}

function testElementRender() {
    const non_typed_var = new PlantumlVariableRender('varName');
    expect(non_typed_var.render()).toBe("varName");

    const typed_var = new PlantumlVariableRender('varName', "integer");
    expect(typed_var.render()).toBe("varName: integer");

    const private_var = new PlantumlVariableRender('varName', "string", PlantumlModifiers.PRIVATE);
    expect(private_var.render()).toBe("- varName: string");

    const name_space = new PlantumlClassDiagramNamespaceElementRender("myclass", "class", "");
    const name_space_reltor = new PlantumlNamespaceRelator(name_space, PlantumlNamespaceRelatorVariant.SIMPLE_RELATION, "relation name", "1", "1");

    expect(name_space_reltor.render()).toBe('myclass "1"--"1" {} : "relation name"');

    const abc_class = new PlantumlClassDiagramNamespaceElementRender("Class1", "abstract", "");
    const conc_class = new PlantumlClassDiagramNamespaceElementRender("Class2", "class", "");
    const other_conc_class = new PlantumlClassDiagramNamespaceElementRender("Class3", `class`, '');
    const anotherone_conc_class = new PlantumlClassDiagramNamespaceElementRender("Class 4", `class`, '');
    const herance = new PlantumlNamespaceRelator(abc_class, PlantumlNamespaceRelatorVariant.EXTENSION);
    const simple_relation = conc_class.addSimpleRelation(other_conc_class, "0..*", "1..*", "relation name");
    conc_class.addRelation(herance);
    conc_class.addSimpleRelation(anotherone_conc_class);

    expect(compareWeightProtocol(herance, simple_relation)).toBe(-1);

    expect(abc_class.render()).toBe("abstract Class1 {\n\n}");
    expect(conc_class.render()).toBe("class Class2 {\n\n}");
    expect(conc_class.renderRelations()).toBe('\tClass1<|--Class2\n\tClass3 "1..*"--"0..*" Class2 : "relation name"\n\t"Class 4"--Class2');

    const specifc_spot = new PlnatumlSpecifSpotNamespace("System", "class", "", "S", "#FF7700", "Singleton");
    expect(specifc_spot.render()).toBe("class System << (S,#FF7700) Singleton >> {\n\n}");

    const simple = new PlantumlSimpleElementRender(PlantumlSimpleElementVariant.CIRCLE_SHORT_FORM, 'circle_short_form');
    expect(simple.render()).toBe("() circle_short_form");
    const simple2 = new PlantumlSimpleElementRender(PlantumlSimpleElementVariant.DIAMOND);
    expect(simple2.render()).toBe("diamond ");

    const imps = new PlantumlNamespaceRelator(conc_class, PlantumlNamespaceRelatorVariant.IMPLEMENTATION);
    const comp = new PlantumlNamespaceRelator(conc_class, PlantumlNamespaceRelatorVariant.COMPOSITION);
    const agre = new PlantumlNamespaceRelator(conc_class, PlantumlNamespaceRelatorVariant.AGGREGATION);

    expect(imps.weight()).toBe(-1);
    expect(comp.weight()).toBe(1);
    expect(agre.weight()).toBe(2);
}

function testTypeLike() {
    const intf = new PlantumlInterfaceRender("Interface1");
    const intf2 = new PlantumlInterfaceRender("Interface2");
    intf2.extends(intf);

    intf.addMethod('method');
    intf.addMethod('method2', [{name: 'param1', varType: 'integer'}], 'integer');

    expect(intf.render()).toBe("interface Interface1 {\n\t{abstract} void method()\n\t{abstract} integer method2(param1: integer)\n}");
    expect(intf2.renderRelations()).toBe("\tInterface1<|--Interface2");

    const base_class = new PlantumlBaseClassRender("cls");
    expect(base_class.render()).toBe('class cls {\n\n}');
    
    const cls1 = new PlantumlAbstractClassRender("MyClass");
    cls1.implements(intf2);
    cls1.addProperty("property1", "integer");
    cls1.addProperty("property2", "string", PlantumlModifiers.PRIVATE);
    cls1.addAbstractMethod("someMethod");
    const cls2 = new PlantumlConcreteClassRender("MyConcreteClass");
    cls2.extends(cls1);

    cls2.addConcreteMethod("myMethod", [{name: 'param1', varType: 'integer'}], "integer", PlantumlModifiers.PROTECTED);
    cls2.addConcreteMethod("myMethod2", [{name: 'param2'}]);
    cls2.addStaticMethod("myStaticMethod");

    expect(cls1.render()).toBe("abstract MyClass {\n\tproperty1: integer\n\t- property2: string\n\t+ {abstract} void someMethod()\n}")
    expect(cls2.render()).toBe("class MyConcreteClass {\n\t* integer myMethod(param1: integer)\n\tvoid myMethod2(param2)\n\t{static} void myStaticMethod()\n}");
    expect(cls1.renderRelations()).toBe("\tInterface2<|..MyClass");
    expect(cls2.renderRelations()).toBe("\tMyClass<|--MyConcreteClass");

    cls2.addMethodObj(new PlantumlMethodRender("", "", "{abstract}"));
    try {
        cls2.render();
    } catch(e) {
        expect(e instanceof SintaxeError).toBe(true);
    }

    const cls3 = new PlantumlConcreteClassRender('cls');
    cls3.addConcreteMethod("method");
    expect(cls3.render()).toBe("class cls {\n\tvoid method()\n}");
}

describe(
    "Plantuml - Classes submodule",
    () =>
    {
        it(
            'Tests the classes package inside plantuml module',
            () =>
            {
                testUtils();                
                testElementRender();
                testTypeLike();
            }
        )
    }
)