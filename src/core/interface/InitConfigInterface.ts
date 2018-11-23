import AbstractManager from "./../implement/AbstractManager";
import AbstractManagerConfig from "./AbstractManagerConfig";
import { ManagerNameSpaces, ComponentNameSpace } from "../../util/enums/NameSpaces";
import AbstractComponent from "../implement/AbstractComponent";


export default interface InitConfigInterface {
    
    readonly managerInfoArray: Array<ManagerInfo>;

    readonly componentInfoArray: Array<ComponentInfo>;
}

export interface ManagerInfo {

    readonly managerNameSpace: ManagerNameSpaces;

    readonly manager: typeof AbstractManager;

    readonly config: AbstractManagerConfig;

}


export interface ComponentInfo {

    readonly componentNameSpace: ComponentNameSpace;

    readonly componentClass: typeof AbstractComponent;

}
