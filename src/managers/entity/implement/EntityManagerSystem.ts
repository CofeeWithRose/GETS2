import {AbstractSystem} from "../../../core/implement/AbstractSystem";
import EntityManagerSystemInterface from "../interface/EntityManagerSystemInterface";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import {GE} from "../../../core/implement/GE";
import { GEEvents } from "../../../util/enums/GEEvent";
import SimpleMap from "../../../util/map/implement/SimpleMap";
import { GameObject } from "./data/GameObject";
import MutiValueMap from "../../../util/map/implement/MutiValueMap";

export default class EntityManagerSystem extends AbstractSystem implements EntityManagerSystemInterface {

    constructor(game: GE,config: AbstractManagerConfig){
        super(game, config);
        this.world.subscribeMssage( GEEvents.ADD_GAMEOBJECT, this.addGameObject );
        this.world.subscribeMssage( GEEvents.REMOVE_GAMEOBJECT, this.removeGameObject);
    };

    protected idMap = new SimpleMap<number, GameObject>();

    protected nameMap = MutiValueMap<string, GameObject>()

    addGameObject = (gameObject: GameObject) => {
        this.idMap.set(gameObject.Id, gameObject);
        this.nameMap.add(gameObject.name, gameObject)
    };

    removeGameObject = ( gameObject: GameObject) => {
        this.idMap.remove( gameObject.Id );
        this.nameMap.removeValue(gameObject.name, gameObject)
    }

    findGameObjectById( gameObjectId: number): GameObject {
        return this.idMap.get(gameObjectId);
    }

    findGameObjectByName(name: string): GameObject{
      return (this.nameMap.get(name)||[])[0]
    }

    findGameObjectsByName(name: string): GameObject[]{
      return this.nameMap.get(name)||[]
    }

}
