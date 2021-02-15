import AbstractManager from "./../implement/AbstractManager";
import AbstractManagerConfig from "./AbstractManagerConfig";
import { ManagerNameSpaces } from "../../util/enums/NameSpaces";


export default interface InitConfigInterface {
    
    readonly managerInfoArray: Array<ManagerInfo>;

}

export interface ManagerInfo {

    readonly managerNameSpace: ManagerNameSpaces;

    readonly manager: typeof AbstractManager;

    readonly config: AbstractManagerConfig;

}


// export interface ComponentInfo {

//     readonly componentNameSpace: ComponentNameSpace;

//     readonly componentClass: typeof AbstractComponent;

// }
