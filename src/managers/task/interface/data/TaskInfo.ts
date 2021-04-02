import { TaskSequence } from "../config/TaskMnagerConfigInterface";
import { TaskType } from "./enum";

export default class TaskInfo {

    constructor( taskNames: string, taskPriority: number, taskType: TaskType, sequence: TaskSequence){
        this.taskNames = taskNames;
        this.taskPriority = taskPriority;
        this.taskType = taskType;
        this.sequence = sequence;
    }

    taskNames: string;
    taskPriority: number;
    taskType: TaskType;
    sequence: TaskSequence
}
