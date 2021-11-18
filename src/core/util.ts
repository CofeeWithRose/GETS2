import { AbstractComponent } from "./implement/AbstractComponent";
import { AllComponentType } from "./interface/AbstractComponentInterface";

const isComponentCache = new Map<AllComponentType, boolean> ()

export function checkIsClassComponentClass(componentClass: AllComponentType): boolean {
    let res = isComponentCache.get(componentClass)
    if(res === undefined) {
        res = hasProtoType(componentClass)
        isComponentCache.set(componentClass, res)
    }
    return res
}


function hasProtoType(componentClass: AllComponentType): boolean {
    let type: any = componentClass;
    while(type) {
        type = Object.getPrototypeOf(type)
        if(type === AbstractComponent) return true
    }
    return false
}


const typeChainCache = new Map<AllComponentType, AllComponentType[]>()

export function getComponentTypeChain(componnet: AbstractComponent): AllComponentType[] {
    let type: AllComponentType = Object.getPrototypeOf(componnet).constructor
    let res = typeChainCache.get(type)
    if(!res) {
        res = getPrototypeChain(type)
        typeChainCache.set(type, res)
    }
    return res;
}

function getPrototypeChain(componentType: AllComponentType): AllComponentType[] {
    let type = componentType
    const typeChain:  AllComponentType[] = [type]
    while(type) {
        type = Object.getPrototypeOf(type)
        typeChain.push(type)
        if(type === AbstractComponent) return typeChain
    }
    return typeChain
}

