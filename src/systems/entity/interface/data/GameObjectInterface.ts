import {AbstractComponentLoaderInterface} from "../../../../core/interface/AbstractComponentLoaderInterface";

export default interface EntityInterface extends AbstractComponentLoaderInterface {

    destory():void;

    readonly Parent: EntityInterface

    addChildren(obj: EntityInterface): void

    removeChildren(obj: EntityInterface): void

    findChildren(id: number): EntityInterface

    
};