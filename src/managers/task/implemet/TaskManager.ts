import {AbstractMnager} from "../../../core/implement/AbstractManager";
import TaskManagerInterface, { EMPTY_TASK } from "../interface/TaskManagerInterface";
import TaskMnagerConfigInterface from "../interface/config/TaskMnagerConfigInterface";
import { GEEvents } from "../../../util/enums/GEEvent";
import {AbstractComponentInterface} from "../../../core/interface/AbstractComponentInterface";
import MutiValueMap from "../../../util/map/implement/MutiValueMap";
import ConfigParser from "./ConfigParser";
import { TaskFlow } from "../../../util/taskflow/implement/TaskFlow";
import { TaskType } from "../interface/data/enum";
import SimpleMap from "../../../util/map/implement/SimpleMap";
import AbstractGEObjectInterface from "../../../core/interface/AbstractGEObjectInterface";
import {AbstractComponentLoaderInterface} from "../../../core/interface/AbstractComponentLoaderInterface";
import { GE } from "../../../core/implement/GE";
import AbstractComponentLoader from "../../../core/implement/AbstractComponentLoader";
import { AbstractComponent } from "../../../core/implement/AbstractComponent";

export default class TaskManager extends AbstractMnager implements TaskManagerInterface {

    constructor(game: GE, config: TaskMnagerConfigInterface) {
        super(game, config);
        this.configParser = new ConfigParser(config);
        this.addGEEvemtListener(GEEvents.ADD_MANAGER, this.addInstanceTask)
        this.addGEEvemtListener(GEEvents.START, this.onStart);
        this.addGEEvemtListener(GEEvents.PAUSE, this.onPause);
        this.addGEEvemtListener(GEEvents.ADD_COMPONENT, this.onAddComponnet);
        this.addGEEvemtListener(GEEvents.REMOVE_COMPONENT, this.onRemoveComponent);
    };

    private configParser: ConfigParser;

    private start = new TaskFlow(TaskType.START);

    private loop = new TaskFlow(TaskType.LOOP);

    private end = new TaskFlow(TaskType.END);

    private instanceTaskId = new SimpleMap<number, MutiValueMap<TaskType, number>>();

    private hasNewComponent = true;

    private isRunning = false;

    private removingComponentList: AbstractComponentInterface[] = []

    private onAddComponnet = ( gamObject:AbstractComponentLoader,  component: AbstractComponent) => {
        this.addInstanceTask(component);
        this.hasNewComponent = true;
    };



    private addInstanceTask = ( component: AbstractGEObjectInterface) => {
        
        const taskInfoArray = this.configParser.getTaskInfoArray(component);
        const componentTaskIdMap = new MutiValueMap<TaskType, number>();
        this.instanceTaskId.set(component.Id, componentTaskIdMap);
        for (let i = 0; i < taskInfoArray.length; i++) {
            const taskInfo = taskInfoArray[i];
            const taskFun: Function = component[taskInfo.taskNames]
            
            if(taskFun && taskFun !== EMPTY_TASK && taskFun instanceof Function){
                const taskId = this[taskInfo.taskType].addTask(taskFun.bind(component), { 
                  priority: taskInfo.taskPriority,
                  sequence: taskInfo.sequence,
                });
                componentTaskIdMap.add(taskInfo.taskType, taskId);
            }
        }
    };

    private removeInstanceTask(idInfo: MutiValueMap<TaskType, number> ){
        this.removeTasks(idInfo, TaskType.START);
        this.removeTasks(idInfo, TaskType.LOOP);
        this.removeTasks(idInfo, TaskType.END);
    };

    private removeTasks( idInfo: MutiValueMap<TaskType, number>, taskType: TaskType ){
        if(idInfo){
            const idSet = idInfo.get(taskType);
            if(idSet){
               const  taskIdArray = idSet.valus();
                const taskFlow = this[taskType];
                for(let i = 0; i < taskIdArray.length; i++){
                    taskFlow.deleteTask( taskIdArray[i]);
                }
            }
        };
    }

    private onRemoveComponent = (_: AbstractComponentLoaderInterface, component: AbstractComponentInterface) => {
      this.removingComponentList.push(component)
    };

    private removeComponent = (component: AbstractComponentInterface) => {
        const idInfo = this.instanceTaskId.get(component.Id);
        const endIdList  = idInfo.get(TaskType.END)
        this.end.runTasks(endIdList.valus())
        this.removeInstanceTask(idInfo);
        this.instanceTaskId.remove(component.Id);
    }

    private onStart = () => {
        if(!this.isRunning){
            const tempRun = this.run;
            this.run = this.emptyRun;
            this.emptyRun = tempRun;
            this.run(performance.now() + performance.timeOrigin);
            this.isRunning = true;
        }
       
    };

    private onPause = () => {
        if(this.isRunning){
            const tempRun = this.run;
            this.run = this.emptyRun;
            this.emptyRun = tempRun;
            this.isRunning = false;
        }
    };
    private run = async (time: number) => {

    }

    protected runStatrtTask = async (time: number) => {
        if(this.hasNewComponent){
            await this.start.runAsyncTask(time);
            this.start.clearAll();
            this.hasNewComponent = false;
        }
    }
    private emptyRun = (time: number) => {
        const now = Date.now()
        return this.runStatrtTask(now).then(() => {
            this.loop.runTask(now);
            this.removingComponentList.forEach(c => {
                this.removeComponent(c)
            })
            this.removingComponentList = []
            window.requestAnimationFrame(this.run);
        })
    }


}
