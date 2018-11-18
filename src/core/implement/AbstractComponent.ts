import AbstractGEObject from "./AbstractGEObject";
import AbstractComponentInterface from "../interface/AbstractComponentInterface";
import { ComponentNameSpace } from "../interface/ComponentNameSpace";
import AbstractComponentLoaderInterface from "../interface/AbstractComponentLoaderInterface";

export default class AbstractComponent extends AbstractGEObject implements AbstractComponentInterface {
  
    private componentNameSpace: ComponentNameSpace;

    private componentLoader: AbstractComponentLoaderInterface;

    get ComponentNameSpace() {
        return this.componentNameSpace;
    }

    get ComponentLoader(){
        return this.componentLoader;
    };

    set ComponentLoader(componentLoader: AbstractComponentLoaderInterface){
        this.componentLoader = componentLoader;
    }

};