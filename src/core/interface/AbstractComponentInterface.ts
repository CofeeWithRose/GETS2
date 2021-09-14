import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import {AbstractComponentLoaderInterface} from "./AbstractComponentLoaderInterface";
import { GE } from "../implement/GE";
import { AbstractManagerConstructor } from "./AbstractManagerInterface";
import AbstractComponentLoader from "../implement/AbstractComponentLoader";
import { Transform } from "../../components/Transform";

export interface AbstractComponentInterface extends AbstractGEObjectInterface {
    
    GameObject: AbstractComponentLoaderInterface;

    getManager<C extends AbstractManagerConstructor<any[]>>(managerConstructor: C ): InstanceType<C>

    destory?(): void

    init(...params: any[]): void

    awake?(): void

    start?(): void

    update?(): void

    willUpdate?(): void

    update?(): void

    updated?(): void

};


export interface AbstractComponentConstructor {
    new (game: GE): AbstractComponentInterface
}

export type FunComponent<T extends {} = {}, Props extends {}=any> = (  ge: GE, obj: AbstractComponentLoader,  props: Props) => T

export type ComponentType = AbstractComponentConstructor| FunComponent<any, any>

export type FuncCompProps<FunC>  = FunC extends  FunComponent<any, infer P>? P : never

export type CompProps<C extends ComponentType> = C extends AbstractComponentConstructor? (InstanceType<C>['init'] extends ((p:infer P ) => any) ? P : never) : FuncCompProps<C>

export type ComponentInstance<ComponentType> =  ComponentType extends AbstractComponentConstructor? InstanceType<ComponentType>: 
ComponentType extends FunComponent<infer T, any>? {Id: number, funcType: Function}&T : never

export type ComponentInfo<C extends ComponentType> = {componentClass: C, props: CompProps<C>}



