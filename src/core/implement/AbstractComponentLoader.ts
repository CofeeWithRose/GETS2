import AbstractGEObject from "./AbstractGEObject";
import AbstractComponentLoaderInterface from "../interface/AbstractComponentLoaderInterface";
import AbstractComponentInterface from "../interface/AbstractComponentInterface";
import MutiValueMap from "../../util/map/implement/MutiValueMap";
import { ComponentNameSpace } from "../../util/enums/NameSpaces";

export default class AbstractComponentLoader extends AbstractGEObject implements AbstractComponentLoaderInterface{

    private componentMap = new MutiValueMap<ComponentNameSpace, AbstractComponentInterface>();
      /**
     * 添加装载的 component.
     * @param component 
     */
    addComponent(component: AbstractComponentInterface): AbstractComponentInterface {
        this.componentMap.add(component.ComponentNameSpace, component);
        return component;
    }

    /**
     * 获取装载的 component.
     * @param componentNameSpace 
     */
    getComponent(componentNameSpace: ComponentNameSpace): AbstractComponentInterface{
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
    getAllComponents(): Array<AbstractComponentInterface>{
        return this.componentMap.values();
    }

     /**
     * 指定 component 的移除 components.
     * @param component 
     */
    removeComponent(component: AbstractComponentInterface): void {
        this.componentMap.removeValue(component.ComponentNameSpace, component);
    }

    /**
     * 指定 namespace 的移除 components.
     * @param componentNameSpace 
     */
    removeComponents(componentNameSpace: ComponentNameSpace): void {
        this.componentMap.removeValues(componentNameSpace);
    }

    /**
     * 移除所有的 components.
     */
    removeAllComponents(): void {
        this.componentMap = new MutiValueMap<ComponentNameSpace, AbstractComponentInterface>();
    }
}