import  { InitConfigInterface,  ManagerInfo, ComponentInfo, ResetParams } from "../interface/InitConfigInterface";
import {AbstractComponentConstructor, AbstractComponentInterface} from "../interface/AbstractComponentInterface";
import AbstractManagerInterface from "../interface/AbstractManagerInterface";
import SimpleMap from "../../util/map/implement/SimpleMap";
import EventEmitor from "../../util/event/EventEmitor";
import { GEEvents, GEEventsMap } from "../../util/enums/GEEvent";
import { ManagerNameSpaces } from "../../util/enums/NameSpaces";
import AbstractComponentLoader from "./AbstractComponentLoader";
import { GameObject } from "../../managers/gameobject/implement/data/GameObject";


export  class GE<ComponentType> {

    private  managerMap = new SimpleMap<ManagerNameSpaces, AbstractManagerInterface>();
    
    private  componentMap = new Map<ComponentType, AbstractComponentConstructor<ComponentType>>();

    private  emitor = new EventEmitor();

    private  INIT_ERROR = new Error( 'Init Error: Please init Before invoke start method !' ); 

    private  hasStarted = false;
    
    /**
     *启动.
     */
     start(){
        this.emitor.emit(GEEvents.START);
        this.hasStarted = true;
    };

    /**
     * 暂停.
     */
     pause(){
        this.emitor.emit(GEEvents.PAUSE);
    };

    /**
     * 根据配置注入 manager.
     * @param initConfigs 
     */
     init( initConfigs: InitConfigInterface<ComponentType> ) {

        this.checkStarted( this.INIT_ERROR );

        this.initManagers(initConfigs.managerInfoArray);

        this.initComponets( initConfigs.componentInfoArray);
     
    };

    /**
     * 注入一个 managerInfo.
     * @param managerInfo 
     */
     initManager( managerInfo: ManagerInfo){

        this.checkStarted( this.INIT_ERROR );
        const manager = new managerInfo.manager(this, managerInfo.config);

        // this.managerMap.set(managerInfo.managerNameSpace, manager);
    };

    /**
     * 注入一个 component.
     * @param componentInfo 
     */
     initComponet( componentInfo: ComponentInfo<ComponentType>) {
        
        this.checkStarted( this.INIT_ERROR );

        this.componentMap.set(componentInfo.componentNameSpace, componentInfo.componentClass);
    };

    private  checkStarted(errorMessage: Error){
        if( this.hasStarted){
            throw errorMessage;
        }
    }

    private  initComponets(componentInfoArray: Array<ComponentInfo<ComponentType>>){
        componentInfoArray.map( componentInfo => {
            this.initComponet(componentInfo);
        } )
    };

    private  initManagers(managerInfos: Array<ManagerInfo>) {

        for(let i = 0; i <managerInfos.length; i++){
            this.initManager( managerInfos[i] );
        }
    }

    /**
     * 获取实例化的 manager.
     * @param managerNameSpace 
     */
     getManager(managerNameSpace: ManagerNameSpaces): AbstractManagerInterface {

       return this.managerMap.get(managerNameSpace);
    };

    /**
     * 触发订阅的事件.
     * @param eventName 
     * @param message 
     */
     sendMessage <T extends keyof GEEventsMap>( eventName: T, ...message: Parameters<GEEventsMap[T]> ) {
        this.emitor.emit(eventName, ...message);
    };

    /**
     * 订阅事件
     * @param eventName 
     * @param fun 
     */
     subscribeMssage <T extends keyof GEEventsMap> (eventName: T, fun : GEEventsMap[T]) {
        this.emitor.addEventListener(eventName, fun);
    };


    /**
     * 取消事件订阅.
     * @param eventName 
     * @param fun 
     */
     unsubscribeMssage (eventName: GEEvents, fun : Function) {
        this.emitor.removeEventListener(eventName, fun);
    };

    /**
     * 实例化组件.
     * @param componentNameSpace 
     */
     instanceComponent<T extends ComponentType> (
         componentNameSpace: T, ...params: ResetParams<T>
    ): AbstractComponentInterface<T> {
        const constructor = this.componentMap.get(componentNameSpace)
        const component =  new constructor(this);
        component.reset(...params)
        return component
    }

    /**
     * 实例化组件容器.
     * @param componentLoader 
     */
     instanceComponentLoader(componentLoader: typeof AbstractComponentLoader): AbstractComponentLoader<ComponentType> {
        return new componentLoader(this);
    } 

    craeteObj(): GameObject<ComponentType>{
        return new GameObject(this)
    }

}
