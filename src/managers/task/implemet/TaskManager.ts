import {AbstractMnager} from "../../../core/implement/AbstractManager";
import TaskManagerInterface, { EMPTY_TASK } from "../interface/TaskManagerInterface";
import TaskMnagerConfigInterface from "../interface/config/TaskMnagerConfigInterface";
import { GEEvents } from "../../../util/enums/GEEvent";
import {AbstractComponentInterface, ComponentInstance, ComponentType} from "../../../core/interface/AbstractComponentInterface";
import MutiValueMap, { MutiValueMapInfer } from "../../../util/map/implement/MutiValueMap";
import ConfigParser from "./ConfigParser";
import { TaskFlow } from "../taskflow/implement/TaskFlow";
import { TaskType } from "../interface/data/enum";
import AbstractGEObjectInterface from "../../../core/interface/AbstractGEObjectInterface";
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
        this.addGEEvemtListener(GEEvents.ADD_CLASS_COMPONENT, this.onAddComponnet);
        this.addGEEvemtListener(GEEvents.REMOVE_CLASS_COMPONENT, this.onRemoveComponent);

        this.addGEEvemtListener(GEEvents.REGIST_TASK, this.onRegistTask)

        this.addGEEvemtListener(GEEvents.REMOVE_FUNC_COMPONENT, this.onRemoveFunComponent)
    };

    private configParser: ConfigParser;

    private start = new TaskFlow(TaskType.START);

    private loop = new TaskFlow(TaskType.LOOP);

    private end = new TaskFlow(TaskType.END);

    private instanceTaskId = new Map<number, MutiValueMapInfer<TaskType, number>>();

    private funCompTaskId = new Map<number, MutiValueMapInfer<TaskType, number>>()

    private hasNewComponent = true;

    private isRunning = false;

    private removingClassComponentList: AbstractComponentInterface[] = []

    private removingFuncCompIdList: number[] = []

    private addedTask: Function[] = []

    private curFunComponentId: number

    private onAddComponnet = ( gamObject:AbstractComponentLoader,  component: AbstractComponent) => {
        this.hasNewComponent = true;
        this.addedTask.push(() => this.addInstanceTask(component) )
        this.curRun = this.runAll
    };

    protected onRegistTask = (methodName: string, taskFun: Function, funCompId?: number ) => {
        const tarskInfoArray = this.configParser.getFuncTaskInfoArray()
        for(let i =0; i< tarskInfoArray.length; i++) {
            const taskInfo = tarskInfoArray[i]
            if(taskInfo.taskNames === methodName){
                let taskId: number
                if(taskInfo.taskType === 'start') {
                    this.hasNewComponent = true
                    this.curRun = this.runAll
                    const startFun = async () => {
                        const lastFunComponentId = this.curFunComponentId
                        this.curFunComponentId = funCompId
                        await taskFun()
                        this.curFunComponentId = lastFunComponentId
                    }
                    this.addedTask.push(() => {
                        taskId = this[taskInfo.taskType].addTask(startFun, { 
                            priority: taskInfo.taskPriority, 
                            sequence: taskInfo.sequence 
                        })
                        this.recordFunTask(taskId, taskInfo.taskType, funCompId)
                    })
                   

                } else {
                    this.addedTask.push(() => {
                        taskId = this[taskInfo.taskType].addTask(taskFun, { priority: taskInfo.taskPriority, sequence: taskInfo.sequence })
                        this.recordFunTask(taskId, taskInfo.taskType, funCompId)
                    })
                }
               
                
            }
        }
    }

    protected flushAddedtask = () => {
        this.addedTask.forEach( task => task() )
        this.addedTask = []
    }
    protected onRemoveFunComponent = (funcCompId: number) => {
        this.removingFuncCompIdList.push(funcCompId)
    }

    protected recordFunTask(taskId: number, taskType: TaskType, componentId?: number) {
        const compId= isNaN(componentId)? this.curFunComponentId : componentId
        let muiMap = this.funCompTaskId.get(compId)
        if(!muiMap) {
            muiMap =  MutiValueMap<TaskType, number>()
            this.funCompTaskId.set(compId, muiMap)
        }
        muiMap.add(taskType, taskId)
    }


    private addInstanceTask = ( component: AbstractGEObjectInterface) => {
        
        const taskInfoArray = this.configParser.getTaskInfoArray(component);
        const componentTaskIdMap =  MutiValueMap<TaskType, number>();
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

    private removeInstanceTask(idInfo: MutiValueMapInfer<TaskType, number> ){
        this.removeTasks(idInfo, TaskType.START);
        this.removeTasks(idInfo, TaskType.LOOP);
        this.removeTasks(idInfo, TaskType.END);
    };

    private removeTasks( idInfo: MutiValueMapInfer<TaskType, number>, taskType: TaskType ){
        if(idInfo){
            const taskIdArray = idInfo.get(taskType);
            if(taskIdArray){
                const taskFlow = this[taskType];
                for(let i = 0; i < taskIdArray.length; i++){
                    taskFlow.deleteTask( taskIdArray[i]);
                }
            }
        };
    }

    private onRemoveComponent = (_: AbstractComponentLoader, component: ComponentInstance<ComponentType>) => {
      this.removingClassComponentList.push(component)
    };

    private removeComponent = (component: AbstractComponentInterface) => {
        const idInfo = this.instanceTaskId.get(component.Id);
        const endIdList  = idInfo.get(TaskType.END)
        this.end.runTasks(endIdList)
        this.removeInstanceTask(idInfo);
        this.instanceTaskId.delete(component.Id);
    }

    private onStart = () => {
        if(!this.isRunning){
            if(this.hasNewComponent) {
                this.curRun = this.runAll
            } else {
                this.curRun = this.runLoop
            }
            this.isRunning = true;
            requestAnimationFrame(() => {
                this.curRun()
            })

        }
       
    };

    private onPause = () => {
        if(this.isRunning){
            const tempRun = this.curRun;
            this.curRun = this.emptyRun;
            this.emptyRun = tempRun;
            this.isRunning = false;
        }
    };

    private emptyRun = () => {}

    private curRun = this .emptyRun

    protected runStatrtTask = (time: number) => {
        this.hasNewComponent = false
        this.curRun = this.runLoop
        this.start.runTask(time);
        this.start.clearAll();
    }

    protected runAll = async () => {
        const now = Date.now()
        this.flushAddedtask()
        this.runStatrtTask(now)
        this.loop.runTask(now);
        this.reomoveComp()
        window.requestAnimationFrame(this.curRun);
    }

    protected reomoveComp = () => {
        this.removingClassComponentList.forEach(c => {
            this.removeComponent(c)
        })
        this.removingFuncCompIdList.forEach( cid => {
            this.removeFunComponent(cid)
        })
        this.removingFuncCompIdList = []
        this.removingClassComponentList = []
    }

    protected removeFunComponent(cid: number) {
        const info = this.funCompTaskId.get(cid)
        const endArray = info.get(TaskType.END)
        this.end.runTasks(endArray)
        this.removeInstanceTask(info)
    }


    protected runLoop = () => {
        // this.flushAddedtask()
        const now = Date.now()
        this.loop.runTask(now);
        this.reomoveComp()
        window.requestAnimationFrame(this.curRun);
    }


}
