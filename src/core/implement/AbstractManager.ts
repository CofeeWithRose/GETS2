import AbstractGEObject from "./AbstractGEObject";
import {AbstractManagerInterface} from "../interface/AbstractManagerInterface";
import AbstractManagerConfig from "../interface/AbstractManagerConfig";
import { GEEventsMap } from "../../util/enums/GEEvent";
import {GE} from "./GE";

export class AbstractMnager extends AbstractGEObject implements AbstractManagerInterface {

    protected game: GE
    
    constructor( game: GE, config: AbstractManagerConfig){
        super();
        this.game = game
    }


    addGEEvemtListener <T extends keyof GEEventsMap>(eventName: T, fun: GEEventsMap[T]) {
        this.game.subscribeMssage(eventName, fun);
    };
}