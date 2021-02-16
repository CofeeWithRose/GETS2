import AbstractGEObject from "./AbstractGEObject";
import AbstractComponentLoaderInterface, { AbstractComponentLoaderEvent } from "../interface/AbstractComponentLoaderInterface";
import {AbstractComponentConstructor, AbstractComponentInterface, ResetParams} from "../interface/AbstractComponentInterface";
import { GEEvents } from "../../util/enums/GEEvent";
import { GE } from "./GE";


export default abstract class AbstractComponentLoader extends AbstractGEObject implements AbstractComponentLoaderInterface {

    protected game: GE

    constructor(game: GE) {
        super();
        this.game = game
    };

    protected parent: AbstractComponentLoaderInterface

    protected children:AbstractComponentLoaderInterface[] = []


    private isActive = true;

    get IsActive() {
        return this.isActive;
    };

    get Parent(): AbstractComponentLoaderInterface {
        return this.parent
    }

    get Children(): AbstractComponentLoaderInterface[] {
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

    private activeAllComponent() {
        const allComponents = [ ...this.componentList ]
        for( let i = 0; i< allComponents.length; i++){
            this.game.sendMessage(GEEvents.ADD_COMPONENT, this, allComponents[i]);
        }
    };

    private disActiveAllComponent(){

        const allComponents: Array<AbstractComponentInterface> = [...this.componentList]
        for( let i = 0; i< allComponents.length; i++){
            this.game.sendMessage(GEEvents.REMOVE_COMPONENT, this, allComponents[i]);
        }
    };

    on<E extends keyof AbstractComponentLoaderEvent>(eventName: E, cb: AbstractComponentLoaderEvent[E]): void {

    }

    /**
     * 添加装载的 component.
     * @param component 
     */
    addComponent<C extends AbstractComponentConstructor> (
        componentClass: C, ...params:  ResetParams<C>
    ): InstanceType<C> {
        const component = new componentClass(this.game)
        component.reset(...params)
        this.componentList.push( component);
        component.ComponentLoader = <any>this;
        if(this.isActive){
            this.game.sendMessage(GEEvents.ADD_COMPONENT, this, component);
        }
        
        return component as InstanceType<C>;
    }

    /**
     * 获取装载的 component.
     * @param componentConstructor 
     */
    getComponent<C extends AbstractComponentConstructor> (
        componentClass: C,
    ): InstanceType<C> {
        for(let i =0; i< this.componentList.length; i++){
            if(this.componentList[i] instanceof componentClass){
                return this.componentList[i] as InstanceType<C>
            }
        }
    }

    /**
     * 获取该类型的所有 component.
     * @param componentConstructor 
     */
    getComponents<C extends AbstractComponentConstructor> (
        componentClass: C
    ): InstanceType<C>[] {
        return this.componentList.filter( c => c instanceof componentClass ) as InstanceType<C>[]
    }

    /**
     * 获取所有装载的 component.
     */
    getAllComponents(): AbstractComponentInterface[] {
        return [...this.componentList]
    }

    /**
    * 指定 component 的移除 components.
    * @param component 
    */
    removeComponent<C extends AbstractComponentConstructor> (
        componentClass: C
    ): void {
        for(let i =0; i< this.componentList.length; i++ ){
            const c = this.componentList[i]
            if( c instanceof componentClass ) {
                this.game.sendMessage(GEEvents.REMOVE_COMPONENT, this, c);
                this.componentList.splice(i, 1)
                return
            }
        }
    }

    /**
     * 指定 namespace 的移除 components.
     * @param componentConstructor 
     */
    removeComponents<C extends AbstractComponentConstructor> (
        componentClass: C
    ): void {
        for ( let i =0; i< this.componentList.length; i++ ) {
            const c = this.componentList[i]
            if ( c instanceof componentClass ) {
                this.game.sendMessage(GEEvents.REMOVE_COMPONENT, this, c);
                this.componentList.splice( i, 1 );
                i--;
            }
        }
    }

    /**
     * 移除所有的 components.
     */
    removeAllComponents(): void {
        const allComponentArray: Array<AbstractComponentInterface> = [...this.componentList]
        for (let i = 0; i < allComponentArray.length; i++) {
            this.game.sendMessage(GEEvents.REMOVE_COMPONENT, this, allComponentArray[i]);
        }
        this.componentList = []
    }
}

