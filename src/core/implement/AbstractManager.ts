import AbstractGEObject from "./AbstractGEObject";
import AbstractManagerInterface from "../interface/AbstractManagerInterface";
import AbstractManagerConfig from "../interface/AbstractManagerConfig";
import { ManagerNameSpaces } from "../../util/enums/NameSpaces";
import { GEEventsMap } from "../../util/enums/GEEvent";
import {GE} from "./GE";

export default class AbstractMnager<ComponentType> extends AbstractGEObject implements AbstractManagerInterface {

    protected game: GE<ComponentType>
    
    constructor( game: GE<ComponentType>, config: AbstractManagerConfig){
        super();
        this.managerNameSpace = ManagerNameSpaces.Default;
        this.game = game
    }

    protected managerNameSpace: ManagerNameSpaces;

    get ManagerNameSpace(){
        return this.managerNameSpace;
    }

    addGEEvemtListener <T extends keyof GEEventsMap>(eventName: T, fun: GEEventsMap[T]) {
        this.game.subscribeMssage(eventName, fun);
    };
}