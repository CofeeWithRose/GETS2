import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import {AbstractComponentInterface} from "../../core/interface/AbstractComponentInterface";
import GameObjectInterface from "../../managers/gameobject/interface/data/GameObjectInterface";

export enum GEEvents {
    
    START = 'START',
    PAUSE = 'PAUSE',
    ADD_COMPONENT = 'ADD_COMPONENT',
    REMOVE_COMPONENT =  'REMOVE_COMPONENT',
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

}
