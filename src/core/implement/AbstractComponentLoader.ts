import AbstractGEObject from "./AbstractGEObject";
import AbstractComponentLoaderInterface from "../interface/AbstractComponentLoaderInterface";
import AbstractComponentInterface from "../interface/AbstractComponentInterface";
import MutiValueMap from "../../util/map/implement/MutiValueMap";
import { ComponentNameSpace } from "../../util/enums/NameSpaces";
import {GE} from "./GE";
import { GEEvents } from "../../util/enums/GEEvent";

export default class AbstractComponentLoader extends AbstractGEObject implements AbstractComponentLoaderInterface {

    constructor() {
        super();
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

    private componentMap = new MutiValueMap<ComponentNameSpace, AbstractComponentInterface>();

    private activeAllComponent() {
        const allComponents: Array<AbstractComponentInterface> = this.componentMap.values();
        for( let i = 0; i< allComponents.length; i++){
            GE.sendMessage(GEEvents.ADD_COMPONENT, this, allComponents[i]);
        }
    };

    private disActiveAllComponent(){

        const allComponents: Array<AbstractComponentInterface> = this.componentMap.values();
        for( let i = 0; i< allComponents.length; i++){
            GE.sendMessage(GEEvents.REMOVE_COMPONENT, this, allComponents[i]);
        }
    };

    /**
     * 添加装载的 component.
     * @param component 
     */
    addComponent(componentNameSpace: ComponentNameSpace): AbstractComponentInterface {
        const component = GE.instanceComponent(componentNameSpace);
        this.componentMap.add(component.ComponentNameSpace, component);
        component.ComponentLoader = <any>this;

        if(this.isActive){
            GE.sendMessage(GEEvents.ADD_COMPONENT, this, component);
        }
        
        return component;
    }

    /**
     * 获取装载的 component.
     * @param componentNameSpace 
     */
    getComponent(componentNameSpace: ComponentNameSpace): AbstractComponentInterface {
        return this.componentMap.get(componentNameSpace).valus()[0];
    }

    /**
     * 获取该类型的所有 component.
     * @param componentNameSpace 
     */
    getComponents(componentNameSpace: ComponentNameSpace): Array<AbstractComponentInterface> {
        return this.componentMap.get(componentNameSpace).valus();
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
        GE.sendMessage(GEEvents.REMOVE_COMPONENT, this, component);
        this.componentMap.removeValue(component.ComponentNameSpace, component);
    }

    /**
     * 指定 namespace 的移除 components.
     * @param componentNameSpace 
     */
    removeComponents(componentNameSpace: ComponentNameSpace): void {

        const components: Array<AbstractComponentInterface> = this.componentMap.get(componentNameSpace).valus();
        for (let i = 0; i < components.length; i++) {
            GE.sendMessage(GEEvents.REMOVE_COMPONENT, this, components[i]);
        }
        this.componentMap.removeValues(componentNameSpace);
    }

    /**
     * 移除所有的 components.
     */
    removeAllComponents(): void {
        const allComponentArray: Array<AbstractComponentInterface> = this.componentMap.values();
        for (let i = 0; i < allComponentArray.length; i++) {
            GE.sendMessage(GEEvents.REMOVE_COMPONENT, this, allComponentArray[i]);
        }
        this.componentMap = new MutiValueMap<ComponentNameSpace, AbstractComponentInterface>();
    }
}