import { AbstractComponent } from "./implement/AbstractComponent";
import { ComponentType } from "./interface/AbstractComponentInterface";

const cacheMap = new Map<ComponentType, boolean> ()

export function checkIsClassComponentClass(componentClass: ComponentType): boolean {
    let res = cacheMap.get(componentClass)
    if(res === undefined) {
        res = hasProtoType(componentClass)
        cacheMap.set(componentClass, res)
    }
    return res
}

function hasProtoType(componentClass: ComponentType): boolean {
    let type: any = componentClass;
    while(type) {
        type = Object.getPrototypeOf(type)
        if(type === AbstractComponent) return true
    }
    return false
}

