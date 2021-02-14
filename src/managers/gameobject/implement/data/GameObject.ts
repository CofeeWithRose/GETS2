import AbstractComponentLoader from "../../../../core/implement/AbstractComponentLoader";
import GameObjectInterface from "../../interface/data/GameObjectInterface";
import {GE} from "../../../../core/implement/GE";
import { GEEvents } from "../../../../util/enums/GEEvent";

export  class GameObject extends AbstractComponentLoader implements GameObjectInterface {

    constructor() {
        super();
        GE.sendMessage( GEEvents.ADD_GAMEOBJECT, this);
    }

    destory(){
        this.removeAllComponents()
        GE.sendMessage( GEEvents.REMOVE_GAMEOBJECT, this);
    };
}