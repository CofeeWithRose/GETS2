import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import { ManagerNameSpace } from "./ManagerNameSpace";

export default interface AbstractManagerInterface extends AbstractGEObjectInterface {
    
    readonly ManagerNameSpace: ManagerNameSpace;

}