import {AbstractSystem} from "../../../core/implement/AbstractSystem";
import TaskSystemInterface from "../interface/TaskSystemInterface";
import TaskMnagerConfigInterface from "../interface/config/TaskMnagerConfigInterface";
import { GEEvents } from "../../../util/enums/GEEvent";
import {AbstractComponentInterface, ComponentInstance, ComponentType} from "../../../core/interface/AbstractComponentInterface";
import MutiValueMap, { MutiValueMapInfer } from "../../../util/map/implement/MutiValueMap";
import ConfigParser from "./ConfigParser";
import { TaskFlow } from "../taskflow/implement/TaskFlow";
import { TaskType } from "../interface/data/enum";
import AbstractGEObjectInterface from "../../../core/interface/AbstractGEObjectInterface";
import { GE } from "../../../core/implement/GE";
import { AbstractComponent } from "../../../core/implement/AbstractComponent";
import { Entity } from "src/systems/entity/implement/data/Entity";

export default class TaskSystem extends AbstractSystem implements TaskSystemInterface {

    private startFlow: TaskFlow

    private loop: TaskFlow

    private end: TaskFlow

    private configParser: ConfigParser;

    private instanceTaskId = new Map<number, MutiValueMapInfer<TaskType, number>>();

    private funCompTaskId = new Map<number, MutiValueMapInfer<TaskType, number>>()

    private hasNewComponent = true;

    private isRunning = false;

    private removingClassComponentList: AbstractComponentInterface[] = []

    private removingFuncCompIdList: number[] = []

    private addedTask: { cId: number, func: Function}[] = []

    private curFunComponentId: number

    private onAddComponnet = ( entity: Entity,  component: AbstractComponent) => {
        this.hasNewComponent = true;
        this.addedTask.push({ cId:component.Id,  func: () => this.addInstanceTask(component)} )
        if(this.isRunning) this.curRun = this.runAll
    };

    constructor(world: GE, config: TaskMnagerConfigInterface) {
        super(world, config);
        this.configParser = new ConfigParser(config);
        this.startFlow = new TaskFlow(TaskType.START, world.logger);
        this.loop = new TaskFlow(TaskType.LOOP, world.logger);
        this.end = new TaskFlow(TaskType.END, world.logger);
        this.addGEEvemtListener(GEEvents.ADD_SYSTEM, this.addInstanceTask)
        this.addGEEvemtListener(GEEvents.START, this.onStart);
        this.addGEEvemtListener(GEEvents.PAUSE, this.onPause);
        this.addGEEvemtListener(GEEvents.ADD_CLASS_COMPONENT, this.onAddComponnet);
        this.addGEEvemtListener(GEEvents.REMOVE_CLASS_COMPONENT, this.onRemoveComponent);
        this.addGEEvemtListener(GEEvents.REGIST_TASK, this.onRegistTask)
        this.addGEEvemtListener(GEEvents.REMOVE_FUNC_COMPONENT, this.onRemoveFunComponent)
    };

   

    protected onRegistTask = (methodName: string, taskFun: Function, funCompId: number ) => {
        if(!funCompId) throw 'No comp Id'
        const tarskInfoArray = this.configParser.getFuncTaskInfoArray()
        for(let i =0; i< tarskInfoArray.length; i++) {
            const taskInfo = tarskInfoArray[i]
            if(taskInfo.taskNames === methodName){
                if(taskInfo.taskType === TaskType.START) {
                    this.hasNewComponent = true
                    if(this.isRunning)  this.curRun = this.runAll
                    const startFun = () => {
                        const lastFunComponentId = this.curFunComponentId
                        this.curFunComponentId = funCompId
                        taskFun()
                        this.curFunComponentId = lastFunComponentId
                    }
                    this.addedTask.push({ 
                        cId: funCompId,
                        func: () => {
                            
                            const taskId = this[taskInfo.taskType].addTask(startFun, { 
                                priority: taskInfo.taskPriority, 
                                sequence: taskInfo.sequence 
                            })
                            this.recordFunTask(taskId, taskInfo.taskType, funCompId||this.curFunComponentId)
                        }
                    })
                } else {
                    this.addedTask.push({
                        cId: funCompId||this.curFunComponentId,
                        func: () => {
                            const taskId = this[taskInfo.taskType].addTask(taskFun, { priority: taskInfo.taskPriority, sequence: taskInfo.sequence })
                            this.recordFunTask(taskId, taskInfo.taskType, funCompId||this.curFunComponentId)
                        }
                    })
                }
               
                
            }
        }
    }

    protected flushAddedtask = () => {
        this.addedTask.forEach( task => task.func() )
        this.addedTask = []
    }
    protected onRemoveFunComponent = (_, component: ComponentInstance<ComponentType>) => {
        this.removingFuncCompIdList.push(component.Id)
        const info = this.funCompTaskId.get(component.Id)
        const endArray = info?.get(TaskType.END)||[]
        this.end.runTasks(endArray)
        this.removeTasks(TaskType.END, info);
    }

    protected handleRemoveComp(compId: number) {
        const idInfo = this.instanceTaskId.get(compId);
        if(!idInfo) return
        const endIdList = idInfo.get(TaskType.END)
        this.end.runTasks(endIdList)
        this.removeTasks(TaskType.END, idInfo);
    }

    protected recordFunTask(taskId: number, taskType: TaskType, componentId?: number) {
        const compId= componentId?? this.curFunComponentId
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
            const emptyTask = AbstractSystem.prototype[taskInfo.taskNames]
            if(taskFun && taskFun !== emptyTask && taskFun instanceof Function){
                const taskId = this[taskInfo.taskType].addTask(taskFun.bind(component), { 
                  priority: taskInfo.taskPriority,
                  sequence: taskInfo.sequence,
                });
                componentTaskIdMap.add(taskInfo.taskType, taskId);
            }
        }
    };

    private removeInstanceTask(idInfo?: MutiValueMapInfer<TaskType, number> ){
        this.removeTasks(TaskType.START, idInfo);
        this.removeTasks(TaskType.LOOP, idInfo);
        this.removeTasks(TaskType.END, idInfo);
    };

    private removeTasks(taskType: TaskType, idInfo?: MutiValueMapInfer<TaskType, number> ){
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

    private onRemoveComponent = (_: Entity, component: ComponentInstance<ComponentType>) => {
      this.removingClassComponentList.push(component)
      this.handleRemoveComp(component.Id)
    };

    private removeComponent = (component: AbstractComponentInterface) => {
        const idInfo = this.instanceTaskId.get(component.Id);
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
            this.curRun = () => {}
            this.isRunning = false;
        }
    };


    private curRun = () => {}

    protected runStatrtTask = (time: number) => {
        this.hasNewComponent = false
        if(this.isRunning) {
            this.curRun = this.runLoop
        }
        this.startFlow.runTask(time);
        this.startFlow.clearAll();
    }

    protected runAll = () => {
        const now = Date.now()
        this.flushAddedtask()
        this.runStatrtTask(now)
        this.loop.runTask(now);
        this.reomoveComp()
        window.requestAnimationFrame(this.curRun);
    }

    protected reomoveComp = () => {
        this.removingClassComponentList.forEach(c => {
            this.removeAddedTask(c.Id)
            this.removeComponent(c)
        })
        this.removingFuncCompIdList.forEach( cid => {
            this.removeAddedTask(cid)
            this.removeFunComponent(cid)
        })
        this.removingFuncCompIdList = []
        this.removingClassComponentList = []
    }

    protected removeAddedTask(id: number) {
        for(let i=0; i<this.addedTask.length; i++) {
            if(this.addedTask[i].cId === id) {
                this.addedTask.splice(i--,1)
            }
        }
    }

    protected removeFunComponent(cid: number) {
        const info = this.funCompTaskId.get(cid)
        // const endArray = info?.get(TaskType.END)||[]
        // this.end.runTasks(endArray)
        this.removeInstanceTask(info)
        this.funCompTaskId.delete(cid)
    }


    protected runLoop = () => {
        // this.flushAddedtask()
        const now = Date.now()
        this.loop.runTask(now);
        this.reomoveComp()
        window.requestAnimationFrame(this.curRun);
    }

    destroy() {
        this.end.runTask(Date.now())
        this.curRun = () => {}
    }

}
