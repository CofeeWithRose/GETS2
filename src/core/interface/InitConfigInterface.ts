import {AbstractMnager} from "./../implement/AbstractManager";
import AbstractManagerConfig from "./AbstractManagerConfig";
import { AbstractComponentConstructor } from "./AbstractComponentInterface";


export interface InitConfigInterface {
    

    readonly managerInfoArray: Array<ManagerInfo>;

}

export interface ManagerInfo {


    readonly manager: typeof AbstractMnager;

    readonly config: AbstractManagerConfig;

}


