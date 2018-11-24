import AbstractMnager from "../../core/implement/AbstractManager";
import GameObjectManagerInterface from "../interface/GameObjectManagerInterface";
import AbstractManagerConfig from "../../core/interface/AbstractManagerConfig";
import GameObjectInterface from "../interface/GameObjectInterface";
import GE from "../../core/implement/GE";
import { GEEvents } from "../../util/enums/GEEvent";
import SimpleMap from "../../util/map/implement/SimpleMap";

export default class GameObjectManager extends AbstractMnager implements GameObjectManagerInterface {

    constructor(config: AbstractManagerConfig){
        super(config);
        GE.subscribeMssage( GEEvents.INSTANCE_COMPONENT_LOADER, this.addGameObject)
    };

    gameObjectIdMap = new SimpleMap<number, GameObjectInterface>();

    addGameObject = (gameObject: GameObjectInterface) => {
        this.gameObjectIdMap.set(gameObject.Id, gameObject);
    };

    findGameObjectById( gameObjectId: number): GameObjectInterface {
        return this.gameObjectIdMap.get(gameObjectId);
    }

}