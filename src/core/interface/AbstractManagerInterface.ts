import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import { ManagerNameSpaces } from "../../util/enums/NameSpaces";

export default interface AbstractManagerInterface extends AbstractGEObjectInterface {
    
    readonly ManagerNameSpace: ManagerNameSpaces;

}