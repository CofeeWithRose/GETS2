import AbstractManagerConfig from "../../../../core/interface/AbstractManagerConfig";
import AbstractGEObject, { AbstractGEObjectConstructor } from "../../../../core/implement/AbstractGEObject";

export default interface TaskMnagerConfigInterface extends AbstractManagerConfig{
    start: Array<RuntimeConfigUnit>;
    loop: Array<RuntimeConfigUnit>;
    end: Array<RuntimeConfigUnit>;
}

export type TaskSequence = 'positive'|  'negative'

export interface RuntimeConfigUnit {
    methodName: string;
    scope: Array<AbstractGEObjectConstructor>;
    /**
     * 正序\倒序执行，默认是正序.
     */
    sequence?: TaskSequence
}

