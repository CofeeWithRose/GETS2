import ArraySet from "../../../util/ArraySet";
import AbstractGEObject from "../../../core/implement/AbstractGEObject";
import MutiValueMap from "../../../util/map/implement/MutiValueMap";
import TaskMnagerConfigInterface, { RuntimeConfigUnit } from "../interface/config/TaskMnagerConfigInterface";
import { TaskType } from "../interface/data/enum";
import TaskInfo from "../interface/data/TaskInfo";
import AbstractGEObjectInterface from "../../../core/interface/AbstractGEObjectInterface";

export default class ConfigParser {


    private classTypeArray = new ArraySet<typeof AbstractGEObject>();

    private classTypeTasksMap = new MutiValueMap<typeof AbstractGEObject, TaskInfo>();
  
    constructor(config: TaskMnagerConfigInterface){
        this.initOnTypeConfig(TaskType.START, config.start);
        this.initOnTypeConfig(TaskType.LOOP, config.loop);
        this.initOnTypeConfig(TaskType.END, config.end);
    }

    getTaskInfoArray(instance: AbstractGEObjectInterface): Array<TaskInfo>{
        const typesArray = this.classTypeArray.valus();
        let result = [];
        for(let i = 0; i< typesArray.length; i++){
            if( instance instanceof typesArray[i] ){
                result = result.concat( this.classTypeTasksMap.get(typesArray[i]).valus() );
            }
        } 
        return result;
    }

    private initOnTypeConfig(type:TaskType, configUnitArray: Array<RuntimeConfigUnit>){
       
        for(let i = 0; i < configUnitArray.length; i++){
            const configUnit = configUnitArray[i];
            const unitScopes = configUnit.scope;
            for(let j = 0; j< unitScopes.length; j++){
                this.classTypeArray.add(unitScopes[i]);
                this.classTypeTasksMap.add( unitScopes[i], 
                    new TaskInfo(configUnit.methodName, i, type));
            }
        }
    }
}













