import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import {AbstractComponentInterface} from "../../core/interface/AbstractComponentInterface";
import { AbstractManagerInterface } from "../../core/interface/AbstractManagerInterface";
import GameObjectInterface from "../../managers/gameobject/interface/data/GameObjectInterface";

export enum GEEvents {
    
    START = 'START',
    PAUSE = 'PAUSE',
    
    ADD_MANAGER = 'ADD_MANAGER',

    ADD_COMPONENT = 'ADD_COMPONENT',
    REMOVE_COMPONENT =  'REMOVE_COMPONENT',

    REGIST_TASK = 'REGIST_TASK',

    ADD_GAMEOBJECT = 'ADD_GAMEOBJECT',
    REMOVE_GAMEOBJECT = 'REMOVE_GAMEOBJECT',
}

export interface GEEventsMap {

    [GEEvents.START]: () => void
    [GEEvents.PAUSE]: () => void

    [GEEvents.ADD_COMPONENT]: (gameObject:AbstractComponentLoader, component: AbstractComponentInterface) => void
    [GEEvents.REMOVE_COMPONENT]: (gameObject:AbstractComponentLoader, component: AbstractComponentInterface) => void

    [GEEvents.ADD_GAMEOBJECT]: (gameObject:GameObjectInterface) => void
    [GEEvents.REMOVE_GAMEOBJECT]: (gameObject:GameObjectInterface) => void

    [GEEvents.ADD_MANAGER]: (gameObject: AbstractManagerInterface) => void

    [GEEvents.REGIST_TASK]: (name: string, type: any, fun: () => void) => void

}
