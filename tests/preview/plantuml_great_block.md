```plantuml
@startuml
    abstract myclass
    class "some class"
    class OtherClass
    myclass <|-- "some class"
    OtherClass "*"--"1" "some class": "relation name"
@enduml
```