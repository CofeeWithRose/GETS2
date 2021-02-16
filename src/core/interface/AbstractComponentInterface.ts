import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import AbstractComponentLoaderInterface from "./AbstractComponentLoaderInterface";
import { GE } from "../implement/GE";
import { AbstractManagerConstructor } from "./AbstractManagerInterface";

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

    afterUpdated(): void
};


export interface AbstractComponentConstructor {
    new (game: GE): AbstractComponentInterface
}

export type ResetParams<C extends AbstractComponentConstructor> = Parameters<InstanceType<C>['init']>

