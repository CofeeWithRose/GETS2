import AbstractGEObject from "./AbstractGEObject";
import {
    AbstractComponentConstructor, AbstractComponentInterface, CompProps, FunComponent, ComponentType, ComponentInstance, ComponentInfo, AllComponentType
} from "../interface/AbstractComponentInterface";
import { GEEvents } from "../../util/enums/GEEvent";
import { GE } from "./GE";
import EventEmitor from "../../util/event/EventEmitor";
import { AbstractComponentLoaderEvent } from "../interface/AbstractComponentLoaderInterface";
import { AbstractComponent } from "./AbstractComponent";
import { checkIsClassComponentClass } from "../util";
import { TransformInfer } from "../../components/Transform";
import { Uuid } from "../../util/uuid";



export default abstract class AbstractComponentLoader extends AbstractGEObject {

    protected world: GE

    transform: TransformInfer

    protected hasLoaded = false

    protected hasDestroy = false

    constructor(world: GE) {
        super();
        this.world = world
    };

    protected parent: AbstractComponentLoader

    protected children:AbstractComponentLoader[] = []

    protected eventEmiter = EventEmitor()

    protected isActive = true;

    readonly id = Uuid.getUuid()

    readonly name: string

    readonly tag: string

    // get IsActive() {
    //     return this.isActive;
    // };

    get Parent(): AbstractComponentLoader {
        return this.parent
    }

    get Children(): AbstractComponentLoader[] {
        return this.children
    }

    // set IsActive(isActive: boolean) {
    //     const isChange = this.isActive !== isActive;
    //     this.isActive = isActive;
    //     if (isChange) {
    //         if (isActive) {
    //             this.activeAllComponent();
    //         } else {
    //             this.disActiveAllComponent();
    //         }
    //     }
    // };

    private componentList: AbstractComponentInterface[] = []

    private funComponentMap = new Map<Function, ComponentInstance<any>[]>() 

    // private activeAllComponent() {
    //     // TODO func component
    //     const allComponents = [ ...this.componentList ]
    //     for( let i = 0; i< allComponents.length; i++){
    //         this.world.sendMessage(GEEvents.ADD_CLASS_COMPONENT, this, allComponents[i]);
    //     }
    // };

    // private disActiveAllComponent(){
    //     // TODO func component
    //     const allComponents: Array<AbstractComponentInterface> = [...this.componentList]
    //     for( let i = 0; i< allComponents.length; i++){
    //         this.world.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, allComponents[i]);
    //     }
    // };

    

    abstract addChildren(obj: AbstractComponentLoader): void

    abstract removeChildren(obj: AbstractComponentLoader): void

    abstract findChildren(id: number): AbstractComponentLoader

    abstract destroy(): void

    // protected curFunCompInfo: { type: ComponentType, id: number}

    protected offlineComponents: ComponentInfo<any>[] = []

    regist(name: string, fun: () => void) {
        // this.game.sendMessage(GEEvents.REGIST_TASK, name, fun, this.curFunCompInfo.id );
    }

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

    // protected isClassComponentClass(componentClass: ComponentType): boolean {
    //     return Object.getPrototypeOf(componentClass) === AbstractComponent
    // }

    protected loadFunComponent<C>(componentClass: FunComponent<C>, params:any): ComponentInstance<FunComponent> {
        // const lastFunCompInfo = this.curFunCompInfo
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
    getComponents<C extends ComponentType> (
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
    getAllComponents(): (AbstractComponentInterface|{Id: number})[] {
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

    on<E extends keyof AbstractComponentLoaderEvent >(
      eventName: E, cb: AbstractComponentLoaderEvent[E]
    ) :void {
        this.eventEmiter.addEventListener(eventName as string, cb)
    };


    off<E extends keyof AbstractComponentLoaderEvent >(
      eventName: E, cb: AbstractComponentLoaderEvent[E]
    ) :void {
        this.eventEmiter.removeEventListener(eventName as string, cb)
    };

    protected emit<E extends keyof AbstractComponentLoaderEvent >(
      eventName: E, ...params: Parameters<AbstractComponentLoaderEvent[E]>
    ) :void {
        this.eventEmiter.emit(eventName as string, ...params)
    };

    
    // TODO
    toJson() {

    }
}

