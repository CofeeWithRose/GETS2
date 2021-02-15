import AbstractMnager from "../../../core/implement/AbstractManager";
import GameObjectManagerInterface from "../interface/GameObjectManagerInterface";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import GameObjectInterface from "../interface/data/GameObjectInterface";
import {GE} from "../../../core/implement/GE";
import { GEEvents } from "../../../util/enums/GEEvent";
import SimpleMap from "../../../util/map/implement/SimpleMap";
import { ManagerNameSpaces } from "../../../util/enums/NameSpaces";
import { injectManagerNameSpace } from "../../../util/decorators/NameSpace";

@injectManagerNameSpace(ManagerNameSpaces.GameObjectManager)
export default class GameObjectManager<ComponentType> extends AbstractMnager<ComponentType> implements GameObjectManagerInterface<ComponentType> {

    constructor(game: GE<ComponentType>,config: AbstractManagerConfig){
        super(game, config);
        this.game.subscribeMssage( GEEvents.ADD_GAMEOBJECT, this.addGameObject );
        this.game.subscribeMssage( GEEvents.REMOVE_GAMEOBJECT, this.removeGameObject);
    };

    gameObjectIdMap = new SimpleMap<number, GameObjectInterface<ComponentType>>();

    addGameObject = (gameObject: GameObjectInterface<ComponentType>) => {
        this.gameObjectIdMap.set(gameObject.Id, gameObject);
    };

    removeGameObject = ( gameObject: GameObjectInterface<ComponentType>) => {
        this.gameObjectIdMap.remove( gameObject.Id );
    }

    findGameObjectById( gameObjectId: number): GameObjectInterface<ComponentType> {
        return this.gameObjectIdMap.get(gameObjectId);
    }

}
