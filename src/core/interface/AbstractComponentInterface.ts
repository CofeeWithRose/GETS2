import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import AbstractComponentLoaderInterface from "./AbstractComponentLoaderInterface";
import { ComponentNameSpace } from "../../util/enums/NameSpaces";
import { GE } from "../implement/GE";

export interface AbstractComponentInterface<ComponentType> extends AbstractGEObjectInterface {
    
    readonly ComponentNameSpace: ComponentNameSpace;

    ComponentLoader: AbstractComponentLoaderInterface<ComponentType>;

    reset(...values: any[]): void
};

export interface AbstractComponentConstructor<ComponentType> {
    new (game: GE<ComponentType>): AbstractComponentInterface<ComponentType>
}

