import { AbstractComponent } from "../../../../core/implement/AbstractComponent";
import { 
    AbstractComponentConstructor, AbstractComponentInterface, 
    AllComponentType, ComponentInfo, ComponentInstance, ComponentType, CompProps, FunComponent 
} from "../../../../core/interface/AbstractComponentInterface";
import { checkIsClassComponentClass } from "../../../../core/util";
import EventEmitor from "../../../../util/event/EventEmitor";
import { Uuid } from "../../../../util/uuid";
import {GE} from "../../../../core/implement/GE";
import { GEEvents } from "../../../../util/enums/GEEvent";

export interface EntityOptions {
    tag?: string
    name?: string
    hadLoaded: boolean
}

export interface EntityEvent {

    parentChange: ( newParent: Entity) => void;
  
    addChild: ( newChildren: Entity) => void
  
    removeChild: (removedChildren: Entity) => void
}

const defaultOptions: EntityOptions = {
    hadLoaded: false
}
export class Entity {

    private componentList: ComponentInstance<any>[] = []

    private funComponentMap = new Map<Function, ComponentInstance<any>[]>() 

    protected world: GE

    protected hasLoaded = false

    protected hasDestroy = false

    protected parent: Entity

    protected children:Entity[] = []

    protected eventEmiter = EventEmitor()

    protected isActive = true;

    readonly id = Uuid.getUuid()

    readonly name: string

    readonly tag: string

    constructor(world: GE, options?:EntityOptions) {
        this.world = world
        options = {...defaultOptions, ...options}
        this.hasLoaded = options.hadLoaded
        this.name = options.name
        this.tag = options.tag
        this.world.sendMessage( GEEvents.ADD_ENTITY, this );
    }

    get Id() {
        return this.id
    }

    get Parent(): Entity {
        return this.parent
    }

    get Children(): Entity[] {
        return this.children
    }

    protected offlineComponents: ComponentInfo<any>[] = []

    regist(name: string, fun: () => void) {}

    /**
     * 添加装载的 component.
     * @param component 
     */
    addComponent<C extends ComponentType> (
        componentClass: C, props: CompProps<C>
    ): void {
        if (this.hasLoaded) {
            this.loadComponent(componentClass, props)
        } else {
            this.offlineComponents.push({ componentClass, props })
        }
       
    }

    protected loadOffineComponents() {
        this.offlineComponents.forEach( ({ componentClass, props }) => {
            this.loadComponent(componentClass, props)
        })
        this.offlineComponents = []
        this.children.forEach( child => child.loadOffineComponents() )
    }

    protected loadComponent<C extends ComponentType> (
        componentClass: C, params:CompProps<C>
    ): ComponentInstance<FunComponent>|ComponentInstance<AbstractComponentConstructor> {
        if(checkIsClassComponentClass(componentClass)) {
            return this.loadClassComponent(componentClass as any, params )
        }else {
           return this.loadFunComponent(componentClass as FunComponent<any>, params)
        }
       
    }

    protected loadFunComponent<C>(componentClass: FunComponent<C>, params:any): ComponentInstance<FunComponent> {
        const curFunCompInfo = {type: componentClass, id: Uuid.getUuid() }
        let componentList = this.funComponentMap.get(componentClass)
        if(!componentList) {
            componentList = []
            this.funComponentMap.set(componentClass, componentList)
        }
        this.regist = (name: string, fun: () => void) => this.world.sendMessage(GEEvents.REGIST_TASK, name, fun, curFunCompInfo.id );
        const instance: Partial<ComponentInstance<FunComponent>> =  componentClass( this.world, this, params )
        instance.Id = curFunCompInfo.id
        instance.funcType = componentClass
        componentList.push(instance)
        if(this.isActive){
            this.world.sendMessage(GEEvents.ADD_FUNC_COMPONENT, this, instance, componentClass);
        }
        return instance as ComponentInstance<FunComponent>
    }

    protected loadClassComponent<C extends AbstractComponentConstructor> (
        componentClass: C, props:  CompProps<C>
    ): InstanceType<C> {
        const component = new componentClass(this.world, props)
        this.componentList.push( component);
        component.Entity = <any>this;
        if(this.isActive){
            this.world.sendMessage(GEEvents.ADD_CLASS_COMPONENT, this, component);
        }
        
        return component as InstanceType<C>;
    }

    

    /**
     * 获取装载的 component.
     * @param componentConstructor 
     */
    getComponent<C extends AllComponentType> (
        componentClass: C,
    ): ComponentInstance<C>|undefined {
        if(checkIsClassComponentClass(componentClass)) {
            return this.getClassComponent(componentClass)
        } else {
            return this.getFunComponent(componentClass)
        }
    }

    protected getFunComponent<C extends AllComponentType> (
        componentClass: C,
    ): ComponentInstance<C> {
        return (this.funComponentMap.get(componentClass)||[])[0];
    }

    protected getClassComponent<C extends AllComponentType> (
        componentClass: C,
    ): ComponentInstance<C>|undefined {
        for(let i =0; i< this.componentList.length; i++){
            if(this.componentList[i] instanceof componentClass){
                return this.componentList[i] as ComponentInstance<C>
            }
        }
    }

    /**
     * 获取该类型的所有 component.
     * @param componentConstructor 
     */
    getComponents<C extends AllComponentType> (
        componentClass: C
    ): ComponentInstance<C>[] {
        if(checkIsClassComponentClass(componentClass)) {
            return this.componentList.filter( c => c instanceof componentClass ) as ComponentInstance<C>[]
            
        }else {
            return this.funComponentMap.get(componentClass)||[]
        }
    }

    /**
     * 获取所有装载的 component.
     */
    getAllComponents(): (ComponentInstance<any>)[] {
        return [...this.componentList, ...this.getAllFunCompoents()]
    }

    protected getAllFunCompoents(): {Id: number}[] {
        const funcComponentList: {Id: number}[] = []
        const valuseIt = this.funComponentMap.values()
        while (true) {
          const next =  valuseIt.next()
          if(next.value) funcComponentList.push(...next.value)
          if(next.done) return funcComponentList
        }
    }

    /**
    * 指定 component 的移除 components.
    * @param component 
    */
    removeComponent<C extends ComponentType> (
        component: ComponentInstance<C>
    ): void {
       if((component as any) instanceof AbstractComponent) {
           return this.removeClassComponent(component)
       } else {
           return this.removeFunComponent(component)
       }
    }

    protected removeFunComponent<C extends ComponentType> (
        component: ComponentInstance<C>
    ): void {
        const componentList = this.funComponentMap.get(component.funcType)
        if (componentList?.length) {
            const index = componentList.indexOf(component)
            if(index < 0) return
            componentList.splice(index, 1)
            this.world.sendMessage(GEEvents.REMOVE_FUNC_COMPONENT, this, component)
        }
    }

    protected removeClassComponent<C extends ComponentType> (
        component: ComponentInstance<C>
    ): void {
        const index = this.componentList.indexOf(component)
        if(index > -1) {
            this.componentList.splice(index, 1)
            this.world.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, component);
        }
    }

    /**
     * 指定 namespace 的移除 components.
     * @param componentConstructor 
     */
    removeComponents<C extends ComponentType> (
        componentClass: C
    ): void {
        if(checkIsClassComponentClass(componentClass)) {
            return this.removeClassComponents(componentClass as AbstractComponentConstructor)
        } else {
            return this.removeFunComponents(componentClass as FunComponent<any>)
        }
      
    }

    protected removeFunComponents(componentClass: FunComponent<any>) {
        const componentArray = this.funComponentMap.get(componentClass)
        if(componentArray) {
            this.funComponentMap.set(componentClass, [])
            componentArray.forEach( c => {
                this.world.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, c.Id)
            })
        }
    }

    protected removeClassComponents<C extends AbstractComponentConstructor> (
        componentClass: C
    ): void {
        for ( let i =0; i< this.componentList.length; i++ ) {
            const c = this.componentList[i]
            if ( c instanceof componentClass ) {
                this.componentList.splice( i, 1 );
                this.world.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, c);
                i--;
            }
        }
    }

    /**
     * 移除所有的 components.
     */
    removeAllComponents(): void {
       this.removeAllClassComponents()
       this.removeAllFuncComponents()
    }

    protected  removeAllClassComponents(): void {
        const allComponentArray: Array<AbstractComponentInterface> = [...this.componentList]
        this.componentList = []
        for (let i = 0; i < allComponentArray.length; i++) {
            this.world.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, allComponentArray[i]);
        }
    }

    protected removeAllFuncComponents(): void {
        const funCompArray = this.getAllFunCompoents()
        this.funComponentMap.clear()
        funCompArray.forEach( c => {
            this.world.sendMessage(GEEvents.REMOVE_FUNC_COMPONENT,this, c)
        })
    }

    on<E extends keyof EntityEvent >(
      eventName: E, cb: EntityEvent[E]
    ) :void {
        this.eventEmiter.addEventListener(eventName as string, cb)
    };


    off<E extends keyof EntityEvent >(
      eventName: E, cb: EntityEvent[E]
    ) :void {
        this.eventEmiter.removeEventListener(eventName as string, cb)
    };

    protected emit<E extends keyof EntityEvent >(
      eventName: E, ...params: Parameters<EntityEvent[E]>
    ) :void {
        this.eventEmiter.emit(eventName as string, ...params)
    };

    addChildren(obj: Entity): void {
        if(obj.parent) throw new Error('repeat load')
        obj.hasLoaded = true
        this.children.push(obj)
        obj.parent = this
        obj.loadOffineComponents()
        this.emit('addChild', obj)
    }


    removeChildren(obj: Entity): void {
        const ind = this.children.indexOf(obj)
        if(ind > -1) {
            this.children.splice(ind, 1)
            obj.hasLoaded = false
        }
        this.emit('removeChild', obj)
    }

    findChildren(id: number): Entity|undefined {
        return this.children.find( ({id: entityId}) => entityId === id )
    }

    destroy = () => {
        const entities: Entity[] = [this]
        for(let i =0 ;i< entities.length; i++) {
            entities.push(...entities[i].children)
        }
        entities.reverse().forEach( obj => {
            if(obj.hasDestroy) return
            obj.hasDestroy = true
            obj.removeAllComponents()
            obj.world.sendMessage( GEEvents.REMOVE_Entity, obj);
            const slib = obj.parent.Children
            const index = slib.indexOf(obj)
            if(index >-1) slib.splice(index, 1)
        })
    };



}

export interface EntityConstructor {
    new (world: GE, options?:EntityOptions):  Entity
}

