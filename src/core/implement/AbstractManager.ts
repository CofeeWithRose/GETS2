import AbstractGEObject from "./AbstractGEObject";
import AbstractManagerInterface from "../interface/AbstractManagerInterface";
import AbstractManagerConfig from "../interface/AbstractManagerConfig";
import { ManagerNameSpaces } from "../../util/enums/NameSpaces";

export default class AbstractMnager extends AbstractGEObject implements AbstractManagerInterface {
    
    constructor(config: AbstractManagerConfig){
        super();
        this.managerNameSpace = ManagerNameSpaces.Default;
    }

    protected managerNameSpace: ManagerNameSpaces;

    get ManagerNameSpace(){
        return this.managerNameSpace;
    }
}