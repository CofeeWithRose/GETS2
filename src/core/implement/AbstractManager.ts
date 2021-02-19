import AbstractGEObject from "./AbstractGEObject";
import {AbstractManagerConstructor, AbstractManagerInterface} from "../interface/AbstractManagerInterface";
import AbstractManagerConfig from "../interface/AbstractManagerConfig";
import { GEEventsMap } from "../../util/enums/GEEvent";
import {GE} from "./GE";
import { EMPTY_TASK } from "../../managers/task/interface/TaskManagerInterface";

export class AbstractMnager extends AbstractGEObject implements AbstractManagerInterface {

    protected game: GE
    
    constructor( game: GE, config: AbstractManagerConfig){
        super();
        this.game = game
    }


    addGEEvemtListener <T extends keyof GEEventsMap>(eventName: T, fun: GEEventsMap[T]) {
        this.game.subscribeMssage(eventName, fun);
    };

    getManager<C extends AbstractManagerConstructor<any[]>>(managerConstructor: C): InstanceType<C>{
      return this.game.getManager(managerConstructor)
    }

    init = EMPTY_TASK

    beforeUpdate = EMPTY_TASK
    
    willUpdate = EMPTY_TASK

    update = EMPTY_TASK

    updated = EMPTY_TASK

    afterUpdated = EMPTY_TASK



}