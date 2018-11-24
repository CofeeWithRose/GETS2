import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import AbstractComponentLoaderInterface from "./AbstractComponentLoaderInterface";
import { ComponentNameSpace } from "../../util/enums/NameSpaces";

export default interface AbstractComponentInterface extends AbstractGEObjectInterface {
    
    readonly ComponentNameSpace: ComponentNameSpace;

    ComponentLoader: AbstractComponentLoaderInterface;

};

