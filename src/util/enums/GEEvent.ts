import { Entity } from "../../systems/entity/implement/data/Entity";
import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import { AbstractComponentInterface, ComponentInstance, ComponentType, FunComponent } from "../../core/interface/AbstractComponentInterface";
import { AbstractSystemInterface } from "../../core/interface/AbstractSystemInterface";

export enum GEEvents {
    
    START = 'START',
    PAUSE = 'PAUSE',
    DESTROY = 'DESTROY',
    
    ADD_SYSTEM = 'ADD_SYSTEM',

    ADD_CLASS_COMPONENT = 'ADD_COMPONENT',
    REMOVE_CLASS_COMPONENT =  'REMOVE_CLASS_COMPONENT',


    ADD_FUNC_COMPONENT = 'ADD_FUNC_COMPONENT',
    REMOVE_FUNC_COMPONENT = 'REMOVE_FUNC_COMPONENT',

    REGIST_TASK = 'REGIST_TASK',

    ADD_ENTITY = 'ADD_ENTITY',
    REMOVE_Entity = 'REMOVE_Entity',
}

export interface GEEventsMap {

    [GEEvents.START]: () => void
    [GEEvents.PAUSE]: () => void

    [GEEvents.ADD_CLASS_COMPONENT]: (entity:AbstractComponentLoader, component: ComponentInstance<ComponentType>) => void
    [GEEvents.REMOVE_CLASS_COMPONENT]: (entity:AbstractComponentLoader, component: AbstractComponentInterface) => void

    [GEEvents.ADD_ENTITY]: (entity:Entity) => void
    [GEEvents.REMOVE_Entity]: (entity:Entity) => void

    [GEEvents.ADD_SYSTEM]: (entity: AbstractSystemInterface) => void

    [GEEvents.REGIST_TASK]: (methodName: string, taskFun: Function, funCompId?: number) => void

    [GEEvents.REMOVE_FUNC_COMPONENT]: (entity:AbstractComponentLoader, component: ComponentInstance<ComponentType>) => void
    [GEEvents.ADD_FUNC_COMPONENT]: (entity:AbstractComponentLoader, component: ComponentInstance<ComponentType>, componentClass: FunComponent) => void

}
