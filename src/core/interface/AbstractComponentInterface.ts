import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import {AbstractComponentLoaderInterface} from "./AbstractComponentLoaderInterface";
import { GE } from "../implement/GE";
import { AbstractManagerConstructor } from "./AbstractManagerInterface";
import AbstractComponentLoader from "../implement/AbstractComponentLoader";
import { Transform } from "../../components/Transform";

export interface AbstractComponentInterface extends AbstractGEObjectInterface {
    
    GameObject: AbstractComponentLoaderInterface;

    getManager<C extends AbstractManagerConstructor<any[]>>(managerConstructor: C ): InstanceType<C>

    destory(): void

    init(...params: any[]): void

    awake(): void

    start(): void

    update(): void

    willUpdate(): void

    update(): void

    updated(): void

};


export interface AbstractComponentConstructor {
    new (game: GE): AbstractComponentInterface
}

export type FunComponent<T> = (  ge: GE, obj: AbstractComponentLoader,  ...params: any[] ) => T

export type ComponentType = AbstractComponentConstructor| FunComponent<any>

export type FuncCompParams<FunC>  = FunC extends  (  ge: GE, obj: AbstractComponentLoader,  ...params: infer P) => any? P : never

export type ResetParams<C extends ComponentType> = C extends AbstractComponentConstructor? Parameters<InstanceType<C>['init']> : FuncCompParams<C>

export type ComponentInstance<ComponentType> =  ComponentType extends AbstractComponentConstructor? InstanceType<ComponentType>: 
ComponentType extends FunComponent<infer T>? T : never

let a: ComponentInstance<typeof Transform>

