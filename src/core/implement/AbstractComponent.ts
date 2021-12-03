import AbstractGEObject from "./AbstractGEObject";
import {AbstractComponentInterface} from "../interface/AbstractComponentInterface";
import {GE} from "./GE";
import { AbstractSystemConstructor } from "../interface/AbstractSystemInterface";
import { EMPTY_TASK } from "../../systems/task/interface/TaskSystemInterface";
import { Entity } from "../../systems/entity/implement/data/Entity";


export  class  AbstractComponent extends AbstractGEObject implements AbstractComponentInterface {

  
    private componentLoader: Entity;

    protected world: GE

    constructor(world: GE, props: any){
        super()
        this.world = world
    }

    get Entity(){
        return this.componentLoader;
    };

    set Entity(componentLoader: Entity){
        this.componentLoader = componentLoader;
    }

    getSystem<C extends AbstractSystemConstructor<any[]>>(systemConstructor: C): undefined|InstanceType<C>{
        return this.world.getSystem( systemConstructor);
    }

    init = EMPTY_TASK

};