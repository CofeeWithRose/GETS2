import AbstractGEObject from "./AbstractGEObject";
import {
    AbstractComponentConstructor, AbstractComponentInterface, CompProps, FunComponent, ComponentType, ComponentInstance, ComponentInfo
} from "../interface/AbstractComponentInterface";
import { GEEvents } from "../../util/enums/GEEvent";
import { GE } from "./GE";
import EventEmitor from "../../util/event/EventEmitor";
import { AbstractComponentLoaderEvent } from "../interface/AbstractComponentLoaderInterface";
import { AbstractComponent } from "./AbstractComponent";
import { TransformInfer } from "src/components/Transform";


let componentLoaderBaseId = 1

let funCompBaseId = 1

export default abstract class AbstractComponentLoader extends AbstractGEObject {

    protected game: GE

    transform: TransformInfer

    protected hasLoaded = false

    constructor(game: GE) {
        super();
        this.game = game
    };

    protected parent: AbstractComponentLoader

    protected children:AbstractComponentLoader[] = []

    protected eventEmiter = EventEmitor()

    protected isActive = true;

    readonly id = componentLoaderBaseId++

    name = `default${this.Id}`

    tag = 'default'

    get IsActive() {
        return this.isActive;
    };

    get Parent(): AbstractComponentLoader {
        return this.parent
    }

    get Children(): AbstractComponentLoader[] {
        return this.children
    }

    set IsActive(isActive: boolean) {
        const isChange = this.isActive !== isActive;
        this.isActive = isActive;
        if (isChange) {
            if (isActive) {
                this.activeAllComponent();
            } else {
                this.disActiveAllComponent();
            }
        }
    };

    private componentList: AbstractComponentInterface[] = []

    private funComponentMap = new Map<Function, any[]>() 

    private activeAllComponent() {
        const allComponents = [ ...this.componentList ]
        for( let i = 0; i< allComponents.length; i++){
            this.game.sendMessage(GEEvents.ADD_CLASS_COMPONENT, this, allComponents[i]);
        }
    };

    private disActiveAllComponent(){

        const allComponents: Array<AbstractComponentInterface> = [...this.componentList]
        for( let i = 0; i< allComponents.length; i++){
            this.game.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, allComponents[i]);
        }
    };

    

    abstract addChildren(obj: AbstractComponentLoader): void

    abstract removeChildren(obj: AbstractComponentLoader): void

    abstract findChildren(id: number): AbstractComponentLoader

    abstract destory(): void

    protected curFunCompInfo: { type: ComponentType, id: number}

    protected offlineComponents: ComponentInfo<any>[] = []

    regist(name: string, fun: () => void) {
        this.game.sendMessage(GEEvents.REGIST_TASK, name, fun, this.curFunCompInfo?.id );
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
    ): ComponentInstance<C> {
        if(this.isClassComponentClass(componentClass)) {
            return this.loadClassComponent(componentClass as any, ...params )
        }else {
           return this.loadFunComponent(componentClass as FunComponent<any>, params)
        }
       
    }

    protected isClassComponentClass(componentClass: ComponentType): boolean {
        return Object.getPrototypeOf(componentClass) === AbstractComponent
    }

    protected loadFunComponent<C>(componentClass: FunComponent<C>, params:any): ReturnType<FunComponent<C>> {
        const lastFunCompInfo = this.curFunCompInfo
        this.curFunCompInfo = {type: componentClass, id: funCompBaseId++ }
        let componentList = this.funComponentMap.get(componentClass)
        if(!componentList) {
            componentList = []
            this.funComponentMap.set(componentClass, componentList)
        }
        const instance: any =  componentClass( this.game, this, params )
        instance._id = this.curFunCompInfo.id
        this.curFunCompInfo = lastFunCompInfo
        componentList.push(instance)
        if(this.isActive){
            this.game.sendMessage(GEEvents.ADD_FUNC_COMPONENT, this, instance, componentClass);
        }
        return instance
    }

    protected loadClassComponent<C extends AbstractComponentConstructor> (
        componentClass: C, ...params:  CompProps<C>
    ): InstanceType<C> {
        const component = new componentClass(this.game)
        component.init(...params)
        this.componentList.push( component);
        component.GameObject = <any>this;
        if(this.isActive){
            this.game.sendMessage(GEEvents.ADD_CLASS_COMPONENT, this, component);
        }
        
        return component as InstanceType<C>;
    }

    

    /**
     * 获取装载的 component.
     * @param componentConstructor 
     */
    getComponent<C extends ComponentType> (
        componentClass: C,
    ): ComponentInstance<C> {
        if(this.isClassComponentClass(componentClass)) {
            return this.getClassComponent(componentClass)
        } else {
            return this.getFunComponent(componentClass)
        }
    }

    protected getFunComponent<C extends ComponentType> (
        componentClass: C,
    ): ComponentInstance<C> {
        return (this.funComponentMap.get(componentClass)||[])[0];
    }

    protected getClassComponent<C extends ComponentType> (
        componentClass: C,
    ): ComponentInstance<C> {
        
        // support func component.
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
        if(this.isClassComponentClass(componentClass)) {
            return this.componentList.filter( c => c instanceof componentClass ) as ComponentInstance<C>[]
            
        }else {
            return this.funComponentMap.get(componentClass)||[]
        }
    }

    /**
     * 获取所有装载的 component.
     */
    getAllComponents(): AbstractComponentInterface[] {
        return [...this.componentList, ...this.getAllFunCompoents()]
    }

    protected getAllFunCompoents(): any[] {
        const funcComponentList = []
        const valuseIt = this.funComponentMap.values()
        while (true) {
          const next =  valuseIt.next()
          if(next.value) funcComponentList.push(next.value)
          if(next.done) return funcComponentList
        }
    }

    /**
    * 指定 component 的移除 components.
    * @param component 
    */
    removeComponent<C extends ComponentType> (
        componentClass: C
    ): void {
       if(this.isClassComponentClass(componentClass)) {
           return this.removeClassComponent(componentClass)
       } 
    }

    protected removeFuncComponent<C extends ComponentType> (
        componentClass: C
    ): void {
        const componentList = this.funComponentMap.get(componentClass)
        if (componentList?.length) {
            const c = componentList.shift()
            this.game.sendMessage(GEEvents.REMOVE_FUNC_COMPONENT, c._id)
        }
    }

    protected removeClassComponent<C extends ComponentType> (
        componentClass: C
    ): void {
        for(let i =0; i< this.componentList.length; i++ ){
            const c = this.componentList[i]
            if( c instanceof componentClass ) {
                this.game.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, c);
                this.componentList.splice(i, 1)
                return
            }
        }
    }

    /**
     * 指定 namespace 的移除 components.
     * @param componentConstructor 
     */
    removeComponents<C extends ComponentType> (
        componentClass: C
    ): void {
        if(this.isClassComponentClass(componentClass)) {
            return this.removeClassComponents(componentClass as AbstractComponentConstructor)
        } else {
            return this.removeFunComponents(componentClass as FunComponent<any>)
        }
      
    }

    protected removeFunComponents(componentClass: FunComponent<any>) {
        const componentArray = this.funComponentMap.get(componentClass)
        if(componentArray) {
            componentArray.forEach( c => {
                this.game.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, c)
            })
            componentArray.splice(0)
        }
    }

    protected removeClassComponents<C extends AbstractComponentConstructor> (
        componentClass: C
    ): void {
        for ( let i =0; i< this.componentList.length; i++ ) {
            const c = this.componentList[i]
            if ( c instanceof componentClass ) {
                this.game.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, c);
                this.componentList.splice( i, 1 );
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
        for (let i = 0; i < allComponentArray.length; i++) {
            this.game.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, allComponentArray[i]);
        }
        this.componentList = []
    }

    protected removeAllFuncComponents(): void {
        const funCompArray = this.getAllFunCompoents()
        funCompArray.forEach( c => {
            this.game.sendMessage(GEEvents.REMOVE_CLASS_COMPONENT, this, c)
        })
        this.funComponentMap.clear()
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

