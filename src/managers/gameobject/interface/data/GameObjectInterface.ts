import AbstractComponentLoaderInterface from "../../../../core/interface/AbstractComponentLoaderInterface";

export default interface GameObjectInterface extends AbstractComponentLoaderInterface {

    destory():void;

    readonly Parent: GameObjectInterface

    addChildren(obj: GameObjectInterface): void

    removeChildren(obj: GameObjectInterface): void

    findChildren(id: number): GameObjectInterface

    
};