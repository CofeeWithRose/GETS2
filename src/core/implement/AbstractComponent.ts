import AbstractGEObject from "./AbstractGEObject";
import {AbstractComponentInterface} from "../interface/AbstractComponentInterface";
import {AbstractComponentLoaderInterface} from "../interface/AbstractComponentLoaderInterface";
import {GE} from "./GE";
import { AbstractSystemConstructor } from "../interface/AbstractSystemInterface";
import { EMPTY_TASK } from "../../systems/task/interface/TaskSystemInterface";


export  class  AbstractComponent extends AbstractGEObject implements AbstractComponentInterface {

  
    private componentLoader: AbstractComponentLoaderInterface;

    private game: GE

    constructor(game: GE){
        super()
        this.game = game
    }

    get Entity(){
        return this.componentLoader;
    };

    set Entity(componentLoader: AbstractComponentLoaderInterface){
        this.componentLoader = componentLoader;
    }

    getSystem<C extends AbstractSystemConstructor<any[]>>(systemConstructor: C): InstanceType<C>{
        return this.game.getSystem( systemConstructor);
    }

    init = EMPTY_TASK

};