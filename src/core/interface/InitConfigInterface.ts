import {AbstractSystem} from "../implement/AbstractSystem";
import AbstractSystemConfig from "./AbstractSystemConfig";
import { AbstractSystemConstructor } from "./AbstractSystemInterface";

export interface LoggerInfer {
    log(message?: any, ...optionalParams: any[]): void;
    warn (message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void
}
export interface InitConfigInterface {
    

    readonly systemConfig: SystemConfig<AbstractSystemConstructor<any>>[];

    logger?: LoggerInfer

}

export interface SystemConfig<M extends AbstractSystemConstructor<any>> {


    readonly systemConstructor: M;

    readonly config: ConstructorParameters<M>[1];

}


