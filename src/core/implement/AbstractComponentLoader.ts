import AbstractGEObject from "./AbstractGEObject";
import AbstractComponentLoaderInterface from "../interface/AbstractComponentLoaderInterface";
import {AbstractComponentConstructor, AbstractComponentInterface} from "../interface/AbstractComponentInterface";
import MutiValueMap from "../../util/map/implement/MutiValueMap";
import { GEEvents } from "../../util/enums/GEEvent";
import { Position2DComponent } from "../../components/position2D/implement/Position2DComponent";
import { GE } from "./GE";
import { ComponentInfo, ResetParams } from "../interface/InitConfigInterface";


export default class AbstractComponentLoader<ComponentType> extends AbstractGEObject implements AbstractComponentLoaderInterface<ComponentType> {

    protected game: GE<any>
    constructor(game: GE<any>) {
        super();
        this.game = game
    };

    private isActive = true;

    get IsActive() {
        return this.isActive;
    };

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

    private componentMap = new MutiValueMap<ComponentType, AbstractComponentInterface>();

    private activeAllComponent() {
        const allComponents: Array<AbstractComponentInterface> = this.componentMap.values();
        for( let i = 0; i< allComponents.length; i++){
            this.game.sendMessage(GEEvents.ADD_COMPONENT, this, allComponents[i]);
        }
    };

    private disActiveAllComponent(){

        const allComponents: Array<AbstractComponentInterface> = this.componentMap.values();
        for( let i = 0; i< allComponents.length; i++){
            this.game.sendMessage(GEEvents.REMOVE_COMPONENT, this, allComponents[i]);
        }
    };

    /**
     * 添加装载的 component.
     * @param component 
     */
    addComponent<T extends ComponentType> (
        componentNameSpace: T, ...params: ResetParams<T>
    ): AbstractComponentInterface<T> {
        const component = this.game.instanceComponent(componentNameSpace, params )
        this.componentMap.add(componentNameSpace, component);
        component.ComponentLoader = <any>this;

        if(this.isActive){
            this.game.sendMessage(GEEvents.ADD_COMPONENT, this, component);
        }
        
        return component;
    }

    /**
     * 获取装载的 component.
     * @param componentConstructor 
     */
    getComponent<C extends AbstractComponentConstructor<any[]>>(componentConstructor: C): AbstractComponentInterface {
        return this.componentMap.get(componentConstructor).valus()[0];
    }

    /**
     * 获取该类型的所有 component.
     * @param componentConstructor 
     */
    getComponents<C extends AbstractComponentConstructor<any[]>>(componentConstructor: C): Array<AbstractComponentInterface> {
        return this.componentMap.get(componentConstructor).valus();
    }

    /**
     * 获取所有装载的 component.
     */
    getAllComponents(): Array<AbstractComponentInterface> {
        return this.componentMap.values();
    }

    /**
    * 指定 component 的移除 components.
    * @param component 
    */
    removeComponent(component: AbstractComponentInterface): void {
        this.game.sendMessage(GEEvents.REMOVE_COMPONENT, this, component);
        const constructor: AbstractComponentConstructor<any> = Object.getPrototypeOf(component).constructor
        this.componentMap.removeValue(constructor, component);
    }

    /**
     * 指定 namespace 的移除 components.
     * @param componentConstructor 
     */
    removeComponents(componentConstructor: AbstractComponentConstructor<any>): void {

        const components: Array<AbstractComponentInterface> = this.componentMap.get(componentConstructor).valus();
        for (let i = 0; i < components.length; i++) {
            this.game.sendMessage(GEEvents.REMOVE_COMPONENT, this, components[i]);
        }
        this.componentMap.removeValues(componentConstructor);
    }

    /**
     * 移除所有的 components.
     */
    removeAllComponents(): void {
        const allComponentArray: Array<AbstractComponentInterface> = this.componentMap.values();
        for (let i = 0; i < allComponentArray.length; i++) {
            this.game.sendMessage(GEEvents.REMOVE_COMPONENT, this, allComponentArray[i]);
        }
        this.componentMap = new MutiValueMap<AbstractComponentConstructor<any>, AbstractComponentInterface>();
    }
}