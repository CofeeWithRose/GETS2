import InitConfigInterface from "./InitConfigInterface";
import AbstractComponentInterface from "./AbstractComponentInterface";
import { ComponentNameSpace } from "./ComponentNameSpace";

export default interface GEInterface {
  
    start(): void;
    
    pause(): void;

    init( managerConfigs: Array<InitConfigInterface> ): void;

    sendMessage( eventName: string, message: any ): void;

    instanceComponent(componentNameSpace: ComponentNameSpace): AbstractComponentInterface;

};