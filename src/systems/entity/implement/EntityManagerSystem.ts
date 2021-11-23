import {AbstractSystem} from "../../../core/implement/AbstractSystem";
import EntityManagerSystemInterface from "../interface/EntityManagerSystemInterface";
import AbstractSystemConfig from "../../../core/interface/AbstractSystemConfig";
import {GE} from "../../../core/implement/GE";
import { GEEvents } from "../../../util/enums/GEEvent";
import { Entity } from "./data/Entity";
import MutiValueMap from "../../../util/map/implement/MutiValueMap";
import { AbstractComponentInterface, AllComponentType, ComponentInstance, ComponentType, FunComponent } from "../../../core/interface/AbstractComponentInterface";
import { getComponentTypeChain } from "../../../core/util";

export default class EntityManagerSystem extends AbstractSystem implements EntityManagerSystemInterface {

    protected idMap = new Map<number, Entity>();

    protected nameMap = MutiValueMap<string, Entity>()

    protected componentType2EntityIndex = new Map<AllComponentType, Entity[]>()

    protected componentIndex = new Map<AllComponentType, ComponentInstance<AllComponentType>[]>()

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

    findEntities(componnetType: AllComponentType ): Entity[] {
        return this.componentType2EntityIndex.get(componnetType)||[]
    }

    findEntity(componnetType: AllComponentType ): Entity|undefined {
        const entities = this.componentType2EntityIndex.get(componnetType)
        return entities? entities[0] : undefined
    }

    findComponents<C extends AllComponentType>(componnetType: C ): ComponentInstance<C>[] {
        return this.componentIndex.get(componnetType)||[]
    }
    
    findComponent<C extends AllComponentType>(componnetType: C ): ComponentInstance<C>|undefined  {
        return this.findComponents(componnetType)[0]
    }
    protected handleAddClassComp = (entity: Entity, component: ComponentInstance<AllComponentType>) => {
        const componentTypes = getComponentTypeChain(component)
        componentTypes.forEach( compType => {
            this.addTypeEntity(compType, entity)
            this.addComponentIndex(compType, component)
        })
    }

    protected addComponentIndex(compType: AllComponentType, component: ComponentInstance<AllComponentType>) {
        let componentList = this.componentIndex.get(compType)
        if(!componentList) {
            componentList = []
            this.componentIndex.set(compType, componentList)
        }
        componentList.push(component)
    }

    protected addTypeEntity(compType: AllComponentType, entity: Entity) {
        if(!compType) this.world.logger.warn('compType', compType);
        let entities: undefined|Entity[] = this.componentType2EntityIndex.get(compType)
        if(!entities) {
            entities = []
            this.componentType2EntityIndex.set(compType, entities)
        }
        if(entities.indexOf(entity) < 0) {
            entities.push(entity)
        }
    }

    protected handleRemoveClassComp = (entity: Entity, component: AbstractComponentInterface) => {
        const componentTypes = getComponentTypeChain(component as ComponentInstance<AllComponentType>)
        componentTypes.forEach( compType => {
            this.removeType(compType, entity)
            this.removeComponentIndex(compType, component)
        })
        
    }

    protected removeComponentIndex(compType: AllComponentType, component: ComponentInstance<AllComponentType>) {
        const componentList = this.componentIndex.get(compType)
        if(componentList) {
            const index = componentList.indexOf(component)
            if(index > -1) componentList.splice(index, 1)
        }
    }

    protected removeType(compType: AllComponentType, entity: Entity) {
        let entities: undefined|Entity[] = this.componentType2EntityIndex.get(compType)
        // check wheather has more than one same type component.
        if(!entities|| entity.getComponent(compType)) return
        // rmove component.
        const entityIndex = entities.indexOf(entity);
        if(entityIndex > -1 ) entities.splice(entityIndex, 1)
    }

    protected handleAddFuncComp = (entity: Entity, component: ComponentInstance<FunComponent>) => {
        this.addTypeEntity(component.funcType, entity)
        this.addComponentIndex(component.funcType, component)
    }

    protected handleRemoveFuncComp = (entity: Entity, component: ComponentInstance<ComponentType>) => {
        this.removeType(component.funcType, entity)
    }

}
