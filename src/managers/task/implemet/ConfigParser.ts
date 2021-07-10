import ArraySet from "../../../util/ArraySet";
import AbstractGEObject, { AbstractGEObjectConstructor } from "../../../core/implement/AbstractGEObject";
import MutiValueMap from "../../../util/map/implement/MutiValueMap";
import TaskMnagerConfigInterface, { RuntimeConfigUnit } from "../interface/config/TaskMnagerConfigInterface";
import { TaskType } from "../interface/data/enum";
import TaskInfo from "../interface/data/TaskInfo";
import AbstractGEObjectInterface from "../../../core/interface/AbstractGEObjectInterface";
import { AbstractComponent } from "../../../core/implement/AbstractComponent";

export default class ConfigParser {


    private classTypeArray = new ArraySet<typeof AbstractGEObject>();

    private classTypeTasksMap = MutiValueMap<typeof AbstractGEObject, TaskInfo>();
  
    private taskInfoCache = new Map<AbstractGEObjectConstructor, TaskInfo[]>()

    constructor(config: TaskMnagerConfigInterface){
        this.initOnTypeConfig(TaskType.START, config.start);
        this.initOnTypeConfig(TaskType.LOOP, config.loop);
        this.initOnTypeConfig(TaskType.END, config.end);
    }

    getFuncTaskInfoArray():Array<TaskInfo> {
        return this.classTypeTasksMap.get(AbstractComponent as any)
    }

    getTaskInfoArray(instance: AbstractGEObjectInterface): Array<TaskInfo>{
      
        const typesArray = this.classTypeArray.valus();
        const constructor = Object.getPrototypeOf(instance).constructor as AbstractGEObjectConstructor
        let result: TaskInfo[] = this.taskInfoCache.get(constructor);
        if(result) return result
        result = []
        console.log('produce task', instance)
        for(let i = 0; i< typesArray.length; i++){
            if( instance instanceof typesArray[i] ){
                result.push( ...this.classTypeTasksMap.get(typesArray[i]));
            }
        } 
        this.taskInfoCache.set(constructor, result)
        return result;

    }

    private initOnTypeConfig(type:TaskType, configUnitArray: Array<RuntimeConfigUnit>){
       
        for(let i = 0; i < configUnitArray.length; i++){
            const configUnit = configUnitArray[i];
            const unitScopes = configUnit.scope;
            for(let j = 0; j< unitScopes.length; j++){
                this.classTypeArray.add(unitScopes[j]);
                this.classTypeTasksMap.add( unitScopes[j], 
                    new TaskInfo(configUnit.methodName, i, type, configUnit.sequence||'positive'));
            }
        }
    }
}













