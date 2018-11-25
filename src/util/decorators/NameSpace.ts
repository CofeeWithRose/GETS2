import { ComponentNameSpace } from "../enums/NameSpaces";

export function injectComponentNameSpace(compoentNameSpace: ComponentNameSpace){
    return function classDecorator<T extends {new(...args:any[]):{}}>(target:T) {
        return class extends target {
            componentNameSpace = compoentNameSpace;
        }
    }
};

export function injectManagerNameSpace(managerNameSpace: ComponentNameSpace){
    return function classDecorator<T extends {new(...args:any[]):{}}>(target:T) {
        return class extends target {
            managerNameSpace = managerNameSpace;
        }
    }
};