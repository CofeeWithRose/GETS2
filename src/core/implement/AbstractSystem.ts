import AbstractGEObject from "./AbstractGEObject";
import {AbstractManagerConstructor, AbstractSystemInterface} from "../interface/AbstractManagerInterface";
import AbstractManagerConfig from "../interface/AbstractManagerConfig";
import { GEEventsMap } from "../../util/enums/GEEvent";
import {GE} from "./GE";
import { EMPTY_TASK } from "../../managers/task/interface/TaskManagerInterface";

export class AbstractSystem extends AbstractGEObject implements AbstractSystemInterface {

    protected world: GE
    
    constructor( world: GE, config: AbstractManagerConfig){
        super();
        this.world = world
    }


    addGEEvemtListener <T extends keyof GEEventsMap>(eventName: T, fun: GEEventsMap[T]) {
        this.world.subscribeMssage(eventName, fun);
    };

    getManager<C extends AbstractManagerConstructor<any[]>>(managerConstructor: C): InstanceType<C>{
      return this.world.getManager(managerConstructor)
    }

    init = EMPTY_TASK

    beforeUpdate = EMPTY_TASK
    
    willUpdate = EMPTY_TASK

    update = EMPTY_TASK

    updated = EMPTY_TASK

    afterUpdated = EMPTY_TASK

    destroy(){}



}