import TaskFolwInterface, { TaskOptions } from "../interface/TaskFlowInterface";
import SimpleMap from "../../map/implement/SimpleMap";

class TaskRecord {

    constructor(priority: number, groupIndex: number, task: Function){
        this.priority = priority;
        this.task = task;
        this.groupIndex = groupIndex
    }
    public priority: number;
    public groupIndex: number;
    public task: Function;
}

export class TaskFlow implements TaskFolwInterface{


    constructor(flowName: string){

        this.flowName = flowName;
    }

    private flowName: string = 'default';

    private taskId: number = 1;

    private idTaskMap: SimpleMap<number, TaskRecord> = new SimpleMap<number, TaskRecord>();

    /**
     * 优先级 -> group -> function
     */
    private tasks: Array<Array<Array<Function>>> = []

    /**
     * key -> group, value -> index in task.  
     */
    private groupMap: Map<string, number> = new Map()

    /**
     * index -> priority, value -> curGroupIndex.
     */
    private curGroupIndexMap = []

    private isRunning = false;

    private deadTempTaskIdArray = new Array<number>();

     /**
     * 
     *按照优先级执行task. 
     * @param priority 优先级 > 0.
     * @param task 执行的方法.
     * @returns 任务的ID.
     */
    public addTask (task: Function, options: TaskOptions): number{
        const { priority, sequence, group } = options
        const groupIndex = this.getGroupIndex(priority, group)
        const taskArray = this.getTaskArray(priority, groupIndex)
        const taskId =  this.taskId++;
        this.idTaskMap.set(taskId, new TaskRecord(priority, groupIndex, task));
        sequence === 'positive'? taskArray.push(task): taskArray.unshift(task)
        return taskId;
    }

    protected getGroupIndex(priority: number,group: string) {
        let groupIndex = this.groupMap.get(group)
        if(groupIndex === undefined) {
            if(this.curGroupIndexMap[priority] === undefined) {
                this.curGroupIndexMap[priority] = 0
            }
            groupIndex = this.curGroupIndexMap[priority]++
            this.groupMap.set(group, groupIndex)
        }
        return groupIndex
    }

    protected getTaskArray(priority: number, groupIndex: number ):  Array<Function> {
        const groupArray = this.getGroupArray(priority)
        let taskArray = groupArray[groupIndex]
        if(!taskArray){
            groupArray[groupIndex] =  taskArray = [];
        }
        return taskArray
    }

    protected getGroupArray(priority: number): Array<Array<Function>>{
        
        let groupArray = this.tasks[priority]
        if(!groupArray) {
            groupArray = this.tasks[priority] = []
        }
        return groupArray
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
            const taskArray: Array<Function>  = this.getTaskArray(taskRecord.priority, taskRecord.groupIndex)
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
        //清空.
        this.deadTempTaskIdArray.splice(0);
    }

    /**
     * 按照优先级执行task.
     */
    public async runAsyncTask(time: number): Promise<void>{
        this.isRunning = true;
        for( let currentPriority = 0; currentPriority < this.tasks.length; currentPriority++){
            const groupArray = this.tasks[currentPriority]||[];
            for(let groupIndex = 0; groupIndex < groupArray.length; groupIndex++){
                const taskArray = groupArray[groupIndex]
                for(let taskIndex = 0; taskIndex < taskArray.length; taskIndex++) {
                    await taskArray[taskIndex](time);
                    debugger
                }
             
            }
        }
        this.isRunning = false;
        this.flushDeadTaskArray();
    };


    /**
     * 按照优先级执行task.
     */
    public runTask(time: number): void{
      this.isRunning = true;
      for( let currentPriority = 0; currentPriority < this.tasks.length; currentPriority++){
          const groupArray = this.tasks[currentPriority]||[];
            groupArray.forEach( taskArray => {
                taskArray.forEach((task) => {
                    task(time);
                })
            })
          //   for(let taskInd = 0; taskInd < taskArry.length; taskInd++){
        //     taskArry[taskInd](time);
        //   }
      }
      this.isRunning = false;
      this.flushDeadTaskArray();
  };



     /**
     * 按照优先级执行task.
     */
    public runTasks(taskIdList: number[]): void{
        this.isRunning = true;
        const taskRecordList = taskIdList.map( taskId => {
            return this.idTaskMap.get(taskId);
        })
        taskRecordList.sort(({priority: p1}, {priority: p2}) => p1-p2 )
        .forEach(({task}) => task() )
        this.isRunning = false;
        this.flushDeadTaskArray();
    };


    public clearAll(): void {

        this.idTaskMap = new SimpleMap<number, TaskRecord>();

        this.tasks = new Array<Array<Array<Function>>>();
    }
       
}
