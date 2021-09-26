import {AbstractSystemInterface} from "../../../core/interface/AbstractManagerInterface";

export default interface TaskManagerInterface extends AbstractSystemInterface {
    
}

export const EMPTY_TASK = (...p: any[]): any => {  }