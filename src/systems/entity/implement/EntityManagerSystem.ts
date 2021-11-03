import {AbstractSystem} from "../../../core/implement/AbstractSystem";
import EntityManagerSystemInterface from "../interface/EntityManagerSystemInterface";
import AbstractSystemConfig from "../../../core/interface/AbstractSystemConfig";
import {GE} from "../../../core/implement/GE";
import { GEEvents } from "../../../util/enums/GEEvent";
import { Entity } from "./data/Entity";
import MutiValueMap from "../../../util/map/implement/MutiValueMap";
import { AbstractComponentInterface, ComponentInstance, ComponentType, FunComponent } from "../../../core/interface/AbstractComponentInterface";
import { getComponentTypeChain } from "../../../core/util";

export default class EntityManagerSystem extends AbstractSystem implements EntityManagerSystemInterface {

    protected idMap = new Map<number, Entity>();

    protected nameMap = MutiValueMap<string, Entity>()

    protected componentEntityMap = new Map<ComponentType, Entity[]>()

    constructor(world: GE,config: AbstractSystemConfig){
        super(world, config);
        this.world.subscribeMssage( GEEvents.ADD_ENTITY, this.addEntity );
        this.world.subscribeMssage( GEEvents.REMOVE_Entity, this.removeEntity);
        this.world.subscribeMssage( GEEvents.ADD_CLASS_COMPONENT, this.handleAddClassComp );
        this.world.subscribeMssage( GEEvents.REMOVE_CLASS_COMPONENT, this.handleRemoveClassComp );
        this.world.subscribeMssage( GEEvents.ADD_FUNC_COMPONENT, this.handleAddFuncComp);
        this.world.subscribeMssage( GEEvents.REMOVE_FUNC_COMPONENT, this.handleRemoveFuncComp );
    };

    destroy() {
        this.world.unsubscribeMssage( GEEvents.ADD_ENTITY, this.addEntity );
        this.world.unsubscribeMssage( GEEvents.REMOVE_Entity, this.removeEntity);
        this.world.unsubscribeMssage( GEEvents.ADD_CLASS_COMPONENT, this.handleAddClassComp );
        this.world.unsubscribeMssage( GEEvents.REMOVE_CLASS_COMPONENT, this.handleRemoveClassComp );
        this.world.unsubscribeMssage( GEEvents.ADD_FUNC_COMPONENT, this.handleAddFuncComp);
        this.world.unsubscribeMssage( GEEvents.REMOVE_FUNC_COMPONENT, this.handleRemoveFuncComp );
    }

    addEntity = (entity: Entity) => {
        this.idMap.set(entity.Id, entity);
        this.nameMap.add(entity.name, entity)
    };

    removeEntity = ( entity: Entity) => {
        this.idMap.delete( entity.Id );
        this.nameMap.removeValue(entity.name, entity)
    }

    findEntityById( entityId: number): Entity|undefined {
        return this.idMap.get(entityId);
    }

    findEntityByName(name: string): Entity{
      return (this.nameMap.get(name)||[])[0]
    }

    findEntitiesByName(name: string): Entity[]{
      return this.nameMap.get(name)||[]
    }

    findEntities(componnetType: ComponentType ): Entity[] {
        return this.componentEntityMap.get(componnetType)||[]
    }
    
    protected handleAddClassComp = (entity: Entity, component: ComponentInstance<ComponentType>) => {
        const componentTypes = getComponentTypeChain(component)
        componentTypes.forEach( compType => this.addTypeEntity(compType, entity))
    }

    protected addTypeEntity(compType: ComponentType, entity: Entity) {
        if(!compType) console.warn('compType', compType);
        let entities: undefined|Entity[] = this.componentEntityMap.get(compType)
        if(!entities) {
            entities = []
            this.componentEntityMap.set(compType, entities)
        }
        if(entities.indexOf(entity) < 0) {
            entities.push(entity)
        }
    }

    protected handleRemoveClassComp = (entity: Entity, component: AbstractComponentInterface) => {
        const componentTypes = getComponentTypeChain(component as ComponentInstance<ComponentType>)
        componentTypes.forEach( compType => this.removeType(compType, entity))
        
    }

    protected removeType(compType: ComponentType, entity: Entity) {
        let entities: undefined|Entity[] = this.componentEntityMap.get(compType)
        // check wheather has more than one same type component.
        if(!entities|| entity.getComponent(compType)) return
        // rmove component.
        const entityIndex = entities.indexOf(entity);
        if(entityIndex > -1 ) entities.splice(entityIndex, 1)
    }

    protected handleAddFuncComp = (entity: Entity, component: ComponentInstance<FunComponent>) => {
        this.addTypeEntity(component.funcType, entity)
    }

    protected handleRemoveFuncComp = (entity: Entity, component: ComponentInstance<ComponentType>) => {
        this.removeType(component.funcType, entity)
    }

}
