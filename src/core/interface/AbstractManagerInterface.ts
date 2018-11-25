import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import { ManagerNameSpaces } from "../../util/enums/NameSpaces";
import { GEEvents } from "../../util/enums/GEEvent";

export default interface AbstractManagerInterface extends AbstractGEObjectInterface {
    
    readonly ManagerNameSpace: ManagerNameSpaces;

    addGEEvemtListener(ventName: GEEvents, fun : Function): void;

}