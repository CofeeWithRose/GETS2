import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import {AbstractComponentLoaderInterface} from "./AbstractComponentLoaderInterface";
import { GE } from "../implement/GE";
import { AbstractSystemConstructor } from "./AbstractSystemInterface";
import AbstractComponentLoader from "../implement/AbstractComponentLoader";

export interface AbstractComponentInterface extends AbstractGEObjectInterface {
    
    Entity: AbstractComponentLoaderInterface;

    getSystem<C extends AbstractSystemConstructor<any[]>>(systemConstructor: C ): undefined|InstanceType<C>

    destroy?(): void

    init(...params: any[]): void

    awake?(): void

    start?(): void

    update?(): void

    willUpdate?(): void

    update?(): void

    updated?(): void

};


export interface AbstractComponentConstructor {
    new (world: GE, props: any): AbstractComponentInterface
}

export type FunComponent<T extends {} = {}, Props extends {}=any> = (  ge: GE, obj: AbstractComponentLoader,  props: Props) => T

export type ComponentType = AbstractComponentConstructor| FunComponent<any, any>

export type FuncCompProps<FunC>  = FunC extends  FunComponent<any, infer P>? P : never

export type CompProps<C extends ComponentType> = C extends AbstractComponentConstructor? ConstructorParameters<C>[1] : FuncCompProps<C>

export type ComponentInstance<ComponentType> =  ComponentType extends AbstractComponentConstructor? InstanceType<ComponentType>: 
ComponentType extends FunComponent<infer T, any>? {Id: number, funcType: FunComponent}&T : never

export type ComponentInfo<C extends ComponentType> = {componentClass: C, props: CompProps<C>}



