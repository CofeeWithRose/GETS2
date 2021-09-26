import {AbstractSystem} from "../implement/AbstractSystem";
import AbstractSystemConfig from "./AbstractSystemConfig";
import { AbstractSystemConstructor } from "./AbstractSystemInterface";


export interface InitConfigInterface {
    

    readonly systemConfig: SystemConfig<AbstractSystemConstructor<any>>[];

}

export interface SystemConfig<M extends AbstractSystemConstructor<any>> {


    readonly systemConstructor: M;

    readonly config: ConstructorParameters<M>[1];

}


