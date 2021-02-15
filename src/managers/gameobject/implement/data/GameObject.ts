import AbstractComponentLoader from "../../../../core/implement/AbstractComponentLoader";
import GameObjectInterface from "../../interface/data/GameObjectInterface";
import {GE} from "../../../../core/implement/GE";
import { GEEvents } from "../../../../util/enums/GEEvent";

export  class GameObject<ComponentType> extends AbstractComponentLoader<ComponentType> implements GameObjectInterface<ComponentType> {

    constructor(game: GE<ComponentType>) {
        super(game);
        game.sendMessage( GEEvents.ADD_GAMEOBJECT, this);
    }

    destory(){
        this.removeAllComponents()
        this.game.sendMessage( GEEvents.REMOVE_GAMEOBJECT, this);
    };
}