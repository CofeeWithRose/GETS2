import AbstractComponentLoaderInterface from "../../../../core/interface/AbstractComponentLoaderInterface";

export default interface GameObjectInterface<ComponentType> extends AbstractComponentLoaderInterface<ComponentType> {

    destory():void;
};