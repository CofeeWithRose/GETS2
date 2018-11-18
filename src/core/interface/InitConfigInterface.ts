import { ManagerNameSpace } from "./ManagerNameSpace";
import AbstractManager from "./../implement/AbstractManager";
import AbstractManagerConfig from "./AbstractManagerConfig";


export default interface InitConfigInterface {
    
    readonly managerNameSpace: ManagerNameSpace;

    readonly manager: typeof AbstractManager;

    readonly config: AbstractManagerConfig;

}

