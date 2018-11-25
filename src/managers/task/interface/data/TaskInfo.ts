import { TaskType } from "./enum";

export default class TaskInfo {

    constructor( taskNames: string, taskPriority: number, taskType: TaskType){
        this.taskNames = taskNames;
        this.taskPriority = taskPriority;
        this.taskType = taskType;
    }

    taskNames: string;
    taskPriority: number;
    taskType: TaskType;
}
