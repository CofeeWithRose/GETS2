import AbstractGEObject from "./AbstractGEObject";
import {AbstractComponentInterface} from "../interface/AbstractComponentInterface";
import AbstractComponentLoaderInterface from "../interface/AbstractComponentLoaderInterface";
import { ComponentNameSpace, ManagerNameSpaces } from "../../util/enums/NameSpaces";
import {GE} from "./GE";

export default class AbstractComponent<ComponentType> extends AbstractGEObject implements AbstractComponentInterface<ComponentType> {
  
    protected componentNameSpace: ComponentNameSpace;

    private componentLoader: AbstractComponentLoaderInterface<ComponentType>;

    protected game: GE<ComponentType>

    constructor(game: GE<ComponentType>){
        super()
        this.game = game
    }

    reset(){}

    get ComponentNameSpace() {
        return this.componentNameSpace;
    }

    get ComponentLoader(){
        return this.componentLoader;
    };

    set ComponentLoader(componentLoader: AbstractComponentLoaderInterface<ComponentType>){
        this.componentLoader = componentLoader;
    }

    getManager(managerNameSpace: ManagerNameSpaces){
        return this.game.getManager( managerNameSpace);
    }

};