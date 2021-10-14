import { AbstractComponent } from "./implement/AbstractComponent";
import { ComponentType } from "./interface/AbstractComponentInterface";

const isComponentCache = new Map<ComponentType, boolean> ()

export function checkIsClassComponentClass(componentClass: ComponentType): boolean {
    let res = isComponentCache.get(componentClass)
    if(res === undefined) {
        res = hasProtoType(componentClass)
        isComponentCache.set(componentClass, res)
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


const typeChainCache = new Map<ComponentType, ComponentType[]>()

export function getComponentTypeChain(componnet: AbstractComponent): ComponentType[] {
    let type: ComponentType = Object.getPrototypeOf(componnet).constructor
    let res = typeChainCache.get(type)
    if(!res) {
        res = getPrototypeChain(type)
        typeChainCache.set(type, res)
    }
    return res;
}

function getPrototypeChain(componentType: ComponentType): ComponentType[] {
    let type = componentType
    const typeChain:  ComponentType[] = [type]
    while(type) {
        type = Object.getPrototypeOf(type)
        typeChain.push(type)
        if(type === AbstractComponent) return typeChain
    }
    return typeChain
}

