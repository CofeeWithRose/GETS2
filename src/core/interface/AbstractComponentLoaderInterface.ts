import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import {AbstractComponentConstructor, AbstractComponentInterface} from "./AbstractComponentInterface";

export default interface AbstractComponentLoaderInterface<ComponentType> extends AbstractGEObjectInterface {

    /**
     * 是否被加入场景, 若没有被加入场景，component不起任何作用.
     */
    IsActive: boolean;

    /**
     * 添加装载的 component.
     * @param component 
     */
    addComponent<T extends  ComponentType>(
        type: T, ...params: ConstructorParameters<C>
    ): AbstractComponentInterface
    /**
     * 获取装载的 component.
     * @param componentConstructor 
     */
    getComponent<C extends AbstractComponentConstructor<any[]>>(
        componentConstructor: C
    ): AbstractComponentInterface;

    /**
     * 获取该类型的所有 component.
     * @param componentConstructor 
     */
    getComponents<C extends AbstractComponentConstructor<any[]>>(
        componentConstructor: C
    ): Array<AbstractComponentInterface>;
    
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
    removeComponents<C extends AbstractComponentConstructor<any[]>>(
        componentConstructor: C
    ): void;

    /**
     * 移除所有的 components.
     */
    removeAllComponents(): void;
};