import { GameObject } from "../../managers/gameobject/implement/data/GameObject";
import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import { AbstractComponentInterface, ComponentInstance, ComponentType, FunComponent } from "../../core/interface/AbstractComponentInterface";
import { AbstractSystemInterface } from "../../core/interface/AbstractManagerInterface";

export enum GEEvents {
    
    START = 'START',
    PAUSE = 'PAUSE',
    DESTROY = 'DESTROY',
    
    ADD_MANAGER = 'ADD_MANAGER',

    ADD_CLASS_COMPONENT = 'ADD_COMPONENT',
    REMOVE_CLASS_COMPONENT =  'REMOVE_CLASS_COMPONENT',


    ADD_FUNC_COMPONENT = 'ADD_FUNC_COMPONENT',
    REMOVE_FUNC_COMPONENT = 'REMOVE_FUNC_COMPONENT',

    REGIST_TASK = 'REGIST_TASK',

    ADD_GAMEOBJECT = 'ADD_GAMEOBJECT',
    REMOVE_GAMEOBJECT = 'REMOVE_GAMEOBJECT',
}

export interface GEEventsMap {

    [GEEvents.START]: () => void
    [GEEvents.PAUSE]: () => void

    [GEEvents.ADD_CLASS_COMPONENT]: (gameObject:AbstractComponentLoader, component: ComponentInstance<ComponentType>) => void
    [GEEvents.REMOVE_CLASS_COMPONENT]: (gameObject:AbstractComponentLoader, component: AbstractComponentInterface) => void

    [GEEvents.ADD_GAMEOBJECT]: (gameObject:GameObject) => void
    [GEEvents.REMOVE_GAMEOBJECT]: (gameObject:GameObject) => void

    [GEEvents.ADD_MANAGER]: (gameObject: AbstractSystemInterface) => void

    [GEEvents.REGIST_TASK]: (methodName: string, taskFun: Function, funCompId?: number) => void

    [GEEvents.REMOVE_FUNC_COMPONENT]: (funCompId: number) => void
    [GEEvents.ADD_FUNC_COMPONENT]: (gameObject:AbstractComponentLoader, component: ComponentInstance<ComponentType>, componentClass: FunComponent) => void

}
