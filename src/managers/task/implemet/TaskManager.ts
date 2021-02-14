import AbstractMnager from "../../../core/implement/AbstractManager";
import TaskManagerInterface from "../interface/TaskManagerInterface";
import { injectManagerNameSpace } from "../../../util/decorators/NameSpace";
import { ManagerNameSpaces } from "../../../util/enums/NameSpaces";
import TaskMnagerConfigInterface, { RuntimeConfigUnit } from "../interface/config/TaskMnagerConfigInterface";
import { GEEvents } from "../../../util/enums/GEEvent";
import AbstractComponentInterface from "../../../core/interface/AbstractComponentInterface";
import AbstractGEObject from "../../../core/implement/AbstractGEObject";
import MutiValueMap from "../../../util/map/implement/MutiValueMap";
import ArraySet from "../../../util/ArraySet";
import ConfigParser from "./ConfigParser";
import { TaskFlow } from "../../../util/taskflow/implement/TaskFlow";
import { TaskType } from "../interface/data/enum";
import SimpleMap from "../../../util/map/implement/SimpleMap";
import AbstractGEObjectInterface from "../../../core/interface/AbstractGEObjectInterface";

@injectManagerNameSpace(ManagerNameSpaces.TaskManager)
export default class TaskManager extends AbstractMnager implements TaskManagerInterface {

    constructor(config: TaskMnagerConfigInterface) {
        super(config);
        this.configParser = new ConfigParser(config);
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

    private onAddComponnet = ( gamObject:AbstractGEObjectInterface,  component: AbstractComponentInterface) => {
        this.addInstanceTask(component);
        this.hasNewComponent = true;
    };

    private addInstanceTask( component: AbstractComponentInterface) {
        
        const taskInfoArray = this.configParser.getTaskInfoArray(component);
        const componentTaskIdMap = new MutiValueMap<TaskType, number>();
        this.instanceTaskId.set(component.Id, componentTaskIdMap);
        for (let i = 0; i < taskInfoArray.length; i++) {
            const taskInfo = taskInfoArray[i];
            const task = component[taskInfo.taskNames]
            if(task){
                const taskId = this[taskInfo.taskType].addTask(
                    taskInfo.taskPriority,
                    task.bind(component),
                );
                componentTaskIdMap.add(taskInfo.taskType, taskId);
            }
           
        }
    };

    private removeInstanceTask(instance: AbstractGEObjectInterface ){
        const idInfo = this.instanceTaskId.get(instance.Id);
        this.removeTasks(idInfo, TaskType.START);
        this.removeTasks(idInfo, TaskType.LOOP);
        this.removeTasks(idInfo, TaskType.END);
        this.instanceTaskId.remove(instance.Id);
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

    private onRemoveComponent = (component: AbstractComponentInterface) => {
        this.removeInstanceTask(component);
    };

    private onStart = () => {
        if(!this.isRunning){
            const tempRun = this.run;
            this.run = this.emptyRun;
            this.emptyRun = tempRun;
            this.run();
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
    private run = () => {

    }

    private emptyRun = () => {
        window.requestAnimationFrame(this.run);
        if(this.hasNewComponent){
            this.start.runTask();
            this.start.clearAll();
            this.hasNewComponent = false;
        }
        this.loop.runTask();
    }


}
