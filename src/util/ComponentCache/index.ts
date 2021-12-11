import { getComponentTypeChain } from "ge";
import { AllComponentType, ComponentInstance } from "src/core/interface/AbstractComponentInterface";
import { CacheArray } from "./CacheArray";

export class ComponentCache<V> {

    protected cache =new Map<AllComponentType, CacheArray<V>>()

    add(component: ComponentInstance<AllComponentType>, value: V) {
        if(component.funcType) {
            this.addValue(component.funcType, value)
            return
        }
        const componentTypes = getComponentTypeChain(component)
        componentTypes.forEach( compType => {
            this.addValue(compType, value)
        })
    }

    get(compType: AllComponentType): CacheArray<V>{
        return this.cache.get(compType)||new CacheArray<V>()
    }

    remove(component: ComponentInstance<AllComponentType>, value: V, ) {
        if(component.funcType) {
            this.removeValue(component.funcType, value)
            return
        }
        const componentTypes = getComponentTypeChain(component)
        componentTypes.forEach( compType => {
            this.removeValue(compType, value)
        })
    }

    protected removeValue(compType: AllComponentType, value: V) {
        let cacheValue: undefined|CacheArray<V> = this.cache.get(compType)
        cacheValue?.delete(value)
        
    }

    protected  addValue(compType: AllComponentType, value: V) {
        let cacheValue: undefined|CacheArray<V> = this.cache.get(compType)
        if(!cacheValue) {
            cacheValue = new CacheArray<V>()
            this.cache.set(compType, cacheValue)
        }
        cacheValue.add(value)
    }
}