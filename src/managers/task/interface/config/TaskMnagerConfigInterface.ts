import AbstractManagerConfig from "../../../../core/interface/AbstractManagerConfig";
import AbstractGEObject from "../../../../core/implement/AbstractGEObject";

export default interface TaskMnagerConfigInterface extends AbstractManagerConfig{
    start: Array<RuntimeConfigUnit>;
    loop: Array<RuntimeConfigUnit>;
    end: Array<RuntimeConfigUnit>;
}

export interface RuntimeConfigUnit {
    methodName: string;
    scope: Array<typeof AbstractGEObject>;
}
