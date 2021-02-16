import {AbstractMnager} from "./../implement/AbstractManager";
import AbstractManagerConfig from "./AbstractManagerConfig";
import { AbstractManagerConstructor } from "./AbstractManagerInterface";


export interface InitConfigInterface {
    

    readonly managerInfoArray: ManagerInfo<AbstractManagerConstructor<any>>[];

}

export interface ManagerInfo<M extends AbstractManagerConstructor<any>> {


    readonly manager: M;

    readonly config: ConstructorParameters<M>[1];

}


