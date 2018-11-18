import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import { ManagerNameSpace } from "./ManagerNameSpace";
import { ComponentNameSpace } from "./ComponentNameSpace";
import AbstractComponentLoaderInterface from "./AbstractComponentLoaderInterface";

export default interface AbstractComponentInterface extends AbstractGEObjectInterface {
    
    readonly ComponentNameSpace: ComponentNameSpace;

    ComponentLoader: AbstractComponentLoaderInterface;

};

