import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import {AbstractComponentConstructor, AbstractComponentInterface, ComponentInstance, ComponentType, ResetParams} from "./AbstractComponentInterface";
import { GE } from "../implement/GE";
import AbstractComponentLoader from "../implement/AbstractComponentLoader";

export interface AbstractComponentLoaderEvent {

  parentChange: ( newParent: AbstractComponentLoader) => void;

  addChild: ( newChildren: AbstractComponentLoader) => void

  removeChild: (removedChildren: AbstractComponentLoader) => void
}

export interface AbstractComponentLoaderInterface extends AbstractGEObjectInterface {

    /**
     * 是否被加入场景, 若没有被加入场景，component不起任何作用.
     */
    IsActive: boolean;

    Parent: AbstractComponentLoaderInterface

    Children: AbstractComponentLoaderInterface[]

    on<E extends keyof AbstractComponentLoaderEvent >(
        eventName: E, cb: AbstractComponentLoaderEvent[E]
    ) :void
    
    regist(name: string, fun: () => void): void

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
    getComponent<C extends ComponentType> (
        componentClass: C
    ):ComponentInstance<C>

    /**
     * 获取该类型的所有 component.
     * @param componentClass 
     */
    getComponents<C extends ComponentType> (
        componentClass: C
    ): ComponentInstance<C>[];
    
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

export interface AbstractComponentLoaderConstructor {
    new (game: GE): AbstractComponentLoaderInterface
}