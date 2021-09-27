import {AbstractSystem} from "../../../core/implement/AbstractSystem";
import EntityManagerSystemInterface from "../interface/EntityManagerSystemInterface";
import AbstractSystemConfig from "../../../core/interface/AbstractSystemConfig";
import {GE} from "../../../core/implement/GE";
import { GEEvents } from "../../../util/enums/GEEvent";
import SimpleMap from "../../../util/map/implement/SimpleMap";
import { Entity } from "./data/Entity";
import MutiValueMap from "../../../util/map/implement/MutiValueMap";

export default class EntityManagerSystem extends AbstractSystem implements EntityManagerSystemInterface {

    constructor(world: GE,config: AbstractSystemConfig){
        super(world, config);
        this.world.subscribeMssage( GEEvents.ADD_ENTITY, this.addEntity );
        this.world.subscribeMssage( GEEvents.REMOVE_Entity, this.removeEntity);
    };

    protected idMap = new SimpleMap<number, Entity>();

    protected nameMap = MutiValueMap<string, Entity>()

    addEntity = (entity: Entity) => {
        this.idMap.set(entity.Id, entity);
        this.nameMap.add(entity.name, entity)
    };

    removeEntity = ( entity: Entity) => {
        this.idMap.remove( entity.Id );
        this.nameMap.removeValue(entity.name, entity)
    }

    findEntityById( entityId: number): Entity {
        return this.idMap.get(entityId);
    }

    findEntityByName(name: string): Entity{
      return (this.nameMap.get(name)||[])[0]
    }

    findEntitiesByName(name: string): Entity[]{
      return this.nameMap.get(name)||[]
    }

}
