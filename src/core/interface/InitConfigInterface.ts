import AbstractManager from "./../implement/AbstractManager";
import AbstractManagerConfig from "./AbstractManagerConfig";
import { ManagerNameSpaces } from "../../util/enums/NameSpaces";
import { AbstractComponentConstructor } from "./AbstractComponentInterface";


export interface InitConfigInterface<ComponentType> {
    
    readonly managerInfoArray: Array<ManagerInfo>;

    readonly componentInfoArray: ComponentInfo<ComponentType>[];
}

export interface ManagerInfo {

    readonly managerNameSpace: ManagerNameSpaces;

    readonly manager: typeof AbstractManager;

    readonly config: AbstractManagerConfig;

}


export interface ComponentInfo<T> {

    readonly componentNameSpace: T;

    readonly componentClass: AbstractComponentConstructor<T>;

}

export type ResetParams<T> = Parameters<InstanceType<ComponentInfo<T>['componentClass']>['reset']>

