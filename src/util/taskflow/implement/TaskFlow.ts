import TaskFolwInterface from "../interface/TaskFlowInterface";
import SimpleMap from "../../map/implement/SimpleMap";

class TaskRecord {

    constructor(priority: number, task: Function){
        this.priority = priority;
        this.task = task;
    }
    public priority: number;
    public task: Function;
}

export class TaskFlow implements TaskFolwInterface{


    constructor(flowName: string){

        this.flowName = flowName;
    }

    private flowName: string = 'default';

    private taskId: number = 1;

    private idTaskMap: SimpleMap<number, TaskRecord> = new SimpleMap<number, TaskRecord>();

    private tasks: Array<Array<Function>> = new Array<Array<Function>>();

    private isRunning = false;

    private deadTempTaskIdArray = new Array<number>();

     /**
     * 
     *按照优先级执行task. 
     * @param priority 优先级 > 0.
     * @param task 执行的方法.
     * @returns 任务的ID.
     */
    public addTask (priority: number, task: Function): number{

        let taskArray = this.tasks[priority];

        if(!taskArray){
            taskArray = new Array<Function>();
            this.tasks[priority] = taskArray;
        }
        const taskId =  this.taskId++;
        this.idTaskMap.set(taskId, new TaskRecord(priority, task));
        taskArray.push(task);
        return taskId;
    }

    /**
     * 总任务队列中删除任务, 若在runTask 时删除，则等到runTask结束后删除.
     * @param taskId 被删除的任务的 taskId.
     */
    public deleteTask (taskId:number): void{

        if(this.isRunning){
            this.deadTempTaskIdArray.push(taskId);
        }else{
            this.deleteTaskRightNow(taskId);
        }
    
    }

    private deleteTaskRightNow (taskId:number): void{
        const taskRecord = this.idTaskMap.get(taskId);
        if(taskRecord){
            const taskArray: Array<Function>  = this.tasks[taskRecord.priority];
            if(taskArray){
                const taskInd: number = taskArray.indexOf(taskRecord.task);
                if(taskInd > -1){
                    taskArray.splice(taskInd, 1);
                    this.idTaskMap.remove(taskId);
                }
            }
        }
    }

    private flushDeadTaskArray (){
        for(let i = 0; i< this.deadTempTaskIdArray.length; i++){
            this.deleteTaskRightNow(this.deadTempTaskIdArray[i]);
        }
        this.deadTempTaskIdArray.splice(0, this.deadTempTaskIdArray.length);
    }

    /**
     * 按照优先级执行task.
     */
    public runTask(): void{
        this.isRunning = true;
        for( let currentPriority = 0; currentPriority < this.tasks.length; currentPriority++){
            const taskArry = this.tasks[currentPriority]||[];
            for(let taskInd = 0; taskInd < taskArry.length; taskInd++){
                taskArry[taskInd]();
            }
        }
        this.isRunning = false;
        this.flushDeadTaskArray();
    };


    public clearAll(): void {

        this.idTaskMap = new SimpleMap<number, TaskRecord>();

        this.tasks = new Array<Array<Function>>();
    }
       
}
