import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import {AbstractComponentConstructor, AbstractComponentInterface, ResetParams} from "./AbstractComponentInterface";

export default interface AbstractComponentLoaderInterface extends AbstractGEObjectInterface {

    /**
     * 是否被加入场景, 若没有被加入场景，component不起任何作用.
     */
    IsActive: boolean;

    /**
     * 添加装载的 component.
     * @param component 
     */
    addComponent<C extends AbstractComponentConstructor> (
        componentClass: C, ...params:  ResetParams<C>
    ): InstanceType<C>

    /**
     * 获取装载的 component.
     * @param componentClass 
     */
    getComponent<C extends AbstractComponentConstructor> (
        componentClass: C
    ):InstanceType<C>

    /**
     * 获取该类型的所有 component.
     * @param componentClass 
     */
    getComponents<C extends AbstractComponentConstructor> (
        componentClass: C
    ): InstanceType<C>[];
    
    /**
     * 获取所有装载的 component.
     */
    getAllComponents(): Array<AbstractComponentInterface>;

    /**
     * 指定 component 的移除 components.
     * @param componentClass 
     */
    removeComponent<C extends AbstractComponentConstructor> (
        componentClass: C, component: InstanceType<C>
    ): void;

    /**
     * 指定 namespace 的移除 components.
     * @param componentClass 
     */
    removeComponents<C extends AbstractComponentConstructor> (
        componentClass: C
    ): void;

    /**
     * 移除所有的 components.
     */
    removeAllComponents(): void;
};