import AbstractGEObject from "./AbstractGEObject";
import AbstractManagerInterface from "../interface/AbstractManagerInterface";
import { ManagerNameSpace } from "../interface/ManagerNameSpace";
import AbstractManagerConfig from "../interface/AbstractManagerConfig";

export default class AbstractMnager extends AbstractGEObject implements AbstractManagerInterface {
    
    constructor(config: AbstractManagerConfig){
        super();
        this.managerNameSpace = ManagerNameSpace.Default;
    }

    private managerNameSpace: ManagerNameSpace;

    get ManagerNameSpace(){
        return this.managerNameSpace;
    }
}