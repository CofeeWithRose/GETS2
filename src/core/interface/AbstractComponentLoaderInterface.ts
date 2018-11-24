import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import AbstractComponentInterface from "./AbstractComponentInterface";
import { ComponentNameSpace } from "../../util/enums/NameSpaces";

export default interface AbstractComponentLoaderInterface extends AbstractGEObjectInterface {

    /**
     * 是否被加入场景, 若没有被加入场景，component不起任何作用.
     */
    IsActive: boolean;

    /**
     * 添加装载的 component.
     * @param component 
     */
    addComponent(component: AbstractComponentInterface): AbstractComponentInterface;

    /**
     * 获取装载的 component.
     * @param componentNameSpace 
     */
    getComponent(componentNameSpace: ComponentNameSpace): AbstractComponentInterface;

    /**
     * 获取该类型的所有 component.
     * @param componentNameSpace 
     */
    getComponents(componentNameSpace: ComponentNameSpace): Array<AbstractComponentInterface>;

    /**
     * 获取所有装载的 component.
     */
    getAllComponents(): Array<AbstractComponentInterface>;

    /**
     * 指定 component 的移除 components.
     * @param component 
     */
    removeComponent(component: AbstractComponentInterface): void;

    /**
     * 指定 namespace 的移除 components.
     * @param componentNameSpace 
     */
    removeComponents(componentNameSpace: ComponentNameSpace): void;

    /**
     * 移除所有的 components.
     */
    removeAllComponents(): void;
};