import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import AbstractComponentLoaderInterface from "./AbstractComponentLoaderInterface";
import { ComponentNameSpace } from "../../util/enums/NameSpaces";

export interface AbstractComponentInterface extends AbstractGEObjectInterface {
    
    readonly ComponentNameSpace: ComponentNameSpace;

    ComponentLoader: AbstractComponentLoaderInterface;

};

export interface AbstractComponentConstructor<P extends any[]> {
    new (...params: P): AbstractComponentInterface
}

