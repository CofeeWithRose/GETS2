import  { InitConfigInterface,  ManagerInfo} from "../interface/InitConfigInterface";
import {AbstractManagerConstructor, AbstractSystemInterface} from "../interface/AbstractManagerInterface";
import EventEmitor from "../../util/event/EventEmitor";
import { GEEvents, GEEventsMap } from "../../util/enums/GEEvent";
import { GameObject, GameObjectOptions } from "../../managers/gameobject/implement/data/GameObject";
import { AbstractComponentLoaderInterface, AbstractComponentLoaderConstructor } from "../interface/AbstractComponentLoaderInterface";
import { Transform, TransformProps } from "../../components/Transform";


export  class GE {

    private  managerList: AbstractSystemInterface[] = [];
    
    private  emitor = EventEmitor();

    private  INIT_ERROR = new Error( 'Init Error: Please init Before invoke start method !' ); 

    private  hasStarted = false;

    isRunning = false

    stage: GameObject

    /**
     * 根据配置注入 manager.
     * @param initConfigs 
     */
     constructor( initConfigs: InitConfigInterface) {

        this.checkStarted( this.INIT_ERROR );

        this.initManagers(initConfigs.managerInfoArray);

        this.stage = new GameObject(this, {hadLoaded: true})
        this.stage.addComponent(Transform,{})
    };

    /**
     *启动.
     */
    start(){
        this.isRunning = true
        this.emitor.emit(GEEvents.START);
        this.hasStarted = true;
    };

    /**
     * 暂停.
     */
    pause(){
        this.emitor.emit(GEEvents.PAUSE);
        this.isRunning = false
    };

    destroy() {
        // TODO enable start.
        this.isRunning = false
        this.managerList.forEach(system => {
            system.destroy()
        })
        this.emitor.emit(GEEvents.DESTROY)
    }

    

    /**
     * 注入一个 managerInfo.
     * @param managerInfo 
     */
    initManager( managerInfo: ManagerInfo<any>){

        this.checkStarted( this.INIT_ERROR );
        const manager = new managerInfo.manager(this, managerInfo.config);
        this.managerList.push(manager)
        this.emitor.emit(GEEvents.ADD_MANAGER, manager)
    };


    private  checkStarted(errorMessage: Error){
        if( this.hasStarted){
            throw errorMessage;
        }
    }

    private  initManagers(managerInfos: Array<ManagerInfo<any>>) {

        for(let i = 0; i <managerInfos.length; i++){
            this.initManager( managerInfos[i] );
        }
    }

    /**
     * 获取实例化的 manager.
     * @param managerNameSpace 
     */
    getManager<C extends AbstractManagerConstructor<any[]>>(managerConstructor: C): InstanceType<C> {

        for(let i=0; i<this.managerList.length; i++){
            if(this.managerList[i] instanceof managerConstructor){
                return this.managerList[i] as InstanceType<C>
            }
        }
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
     * 实例化组件容器.
     * @param componentLoader 
     */
    instanceComponentLoader(componentLoader: AbstractComponentLoaderConstructor): AbstractComponentLoaderInterface {
        return new componentLoader(this);
    } 

    craeteObj(transformProps: Partial<TransformProps>, options?: Omit<GameObjectOptions, 'hadLoaded'>): GameObject{
        const obj = new GameObject(this, {hadLoaded: false, ...options})
        obj.addComponent(Transform, transformProps)
        this.sendMessage( GEEvents.ADD_GAMEOBJECT, this.stage );
        return obj
    }

}
