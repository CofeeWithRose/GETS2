import AbstractGEObject from "./AbstractGEObject";
import {AbstractComponentInterface} from "../interface/AbstractComponentInterface";
import {AbstractComponentLoaderInterface} from "../interface/AbstractComponentLoaderInterface";
import {GE} from "./GE";
import { AbstractManagerConstructor } from "../interface/AbstractManagerInterface";
import { EMPTY_TASK } from "../../managers/task/interface/TaskManagerInterface";


export  class  AbstractComponent extends AbstractGEObject implements AbstractComponentInterface {

  
    private componentLoader: AbstractComponentLoaderInterface;

    private game: GE

    constructor(game: GE){
        super()
        this.game = game
    }

    get GameObject(){
        return this.componentLoader;
    };

    set GameObject(componentLoader: AbstractComponentLoaderInterface){
        this.componentLoader = componentLoader;
    }

    getManager<C extends AbstractManagerConstructor<any[]>>(managerConstructor: C): InstanceType<C>{
        return this.game.getManager( managerConstructor);
    }

    init = EMPTY_TASK

};