import {AbstractMnager} from "../../../core/implement/AbstractManager";
import GameObjectManagerInterface from "../interface/GameObjectManagerInterface";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import GameObjectInterface from "../interface/data/GameObjectInterface";
import {GE} from "../../../core/implement/GE";
import { GEEvents } from "../../../util/enums/GEEvent";
import SimpleMap from "../../../util/map/implement/SimpleMap";
import { GameObject } from "./data/GameObject";

export default class GameObjectManager extends AbstractMnager implements GameObjectManagerInterface {

    constructor(game: GE,config: AbstractManagerConfig){
        super(game, config);
        this.game.subscribeMssage( GEEvents.ADD_GAMEOBJECT, this.addGameObject );
        this.game.subscribeMssage( GEEvents.REMOVE_GAMEOBJECT, this.removeGameObject);
    };

    gameObjectIdMap = new SimpleMap<number, GameObject>();

    addGameObject = (gameObject: GameObject) => {
        this.gameObjectIdMap.set(gameObject.Id, gameObject);
    };

    removeGameObject = ( gameObject: GameObject) => {
        this.gameObjectIdMap.remove( gameObject.Id );
    }

    findGameObjectById( gameObjectId: number): GameObject {
        return this.gameObjectIdMap.get(gameObjectId);
    }

}
