import AbstractGEObject from "./AbstractGEObject";
import {AbstractSystemConstructor, AbstractSystemInterface} from "../interface/AbstractSystemInterface";
import AbstractSystemConfig from "../interface/AbstractSystemConfig";
import { GEEventsMap } from "../../util/enums/GEEvent";
import {GE} from "./GE";
import { EMPTY_TASK } from "../../systems/task/interface/TaskSystemInterface";

export abstract class AbstractSystem extends AbstractGEObject implements AbstractSystemInterface {

    protected world: GE
    
    constructor( world: GE, config: AbstractSystemConfig){
        super();
        this.world = world
    }


    addGEEvemtListener <T extends keyof GEEventsMap>(eventName: T, fun: GEEventsMap[T]) {
        this.world.subscribeMssage(eventName, fun);
    };

    getSystem<C extends AbstractSystemConstructor<any[]>>(systemConstructor: C): undefined| InstanceType<C>{
      return this.world.getSystem(systemConstructor)
    }

    abstract init(): void

    abstract beforeUpdate(): void
    
    abstract willUpdate (): void

    abstract update(): void

    abstract afterUpdated(): void

    abstract destroy(): void

}