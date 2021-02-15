import AbstractGEObject from "./AbstractGEObject";
import {AbstractComponentInterface} from "../interface/AbstractComponentInterface";
import AbstractComponentLoaderInterface from "../interface/AbstractComponentLoaderInterface";
import { ComponentNameSpace, ManagerNameSpaces } from "../../util/enums/NameSpaces";
import {GE} from "./GE";

export default class AbstractComponent extends AbstractGEObject implements AbstractComponentInterface {
  
    protected componentNameSpace: ComponentNameSpace;

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

    getManager(managerNameSpace: ManagerNameSpaces){
        return GE.getManager( managerNameSpace);
    }

};