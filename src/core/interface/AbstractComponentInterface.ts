import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import { GE } from "../implement/GE";
import { AbstractSystemConstructor } from "./AbstractSystemInterface";
import { Entity } from "../../systems/entity/implement/data/Entity";

export interface AbstractComponentInterface extends AbstractGEObjectInterface {
    
    Entity: Entity;

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

type Constructor< T > = Function & { prototype: T }

export type FunComponent<T extends {} = {}, Props extends {}=any> = (  ge: GE, entity: Entity,  props: Props) => T

export type ComponentType = AbstractComponentConstructor| FunComponent<any, any>
// include astract class.
export type AllComponentType = ComponentType | Constructor<Entity>

export type FuncCompProps<FunC>  = FunC extends  FunComponent<any, infer P>? P : never

export type CompProps<C extends ComponentType> = C extends AbstractComponentConstructor? ConstructorParameters<C>[1] : FuncCompProps<C>

export type ComponentInstance<AllComponentType> =  AllComponentType extends AbstractComponentConstructor? InstanceType<AllComponentType>
: AllComponentType extends FunComponent<infer T, any> ? {Id: number, funcType: FunComponent}&T 
: AllComponentType extends Constructor<infer T > ? T
: never

export type ComponentInfo<C extends ComponentType> = {componentClass: C, props: CompProps<C>}



