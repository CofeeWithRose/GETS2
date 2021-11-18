import  { InitConfigInterface,  SystemConfig} from "../interface/InitConfigInterface";
import {AbstractSystemConstructor, AbstractSystemInterface} from "../interface/AbstractSystemInterface";
import EventEmitor from "../../util/event/EventEmitor";
import { GEEvents, GEEventsMap } from "../../util/enums/GEEvent";
import { Entity, EntityOptions } from "../../systems/entity/implement/data/Entity";
import { AbstractComponentLoaderInterface, AbstractComponentLoaderConstructor } from "../interface/AbstractComponentLoaderInterface";
import { Transform, TransformProps } from "../../components/Transform";
import { AllComponentType, ComponentInstance, ComponentType } from "../interface/AbstractComponentInterface";
import EntityManagerSystem from "../../systems/entity/implement/EntityManagerSystem";


export  class GE {

    private  systemList: AbstractSystemInterface[] = [];
    
    private  emitor = EventEmitor();

    private  INIT_ERROR = new Error( 'Init Error: Please init Before invoke start method !' ); 

    private  hasStarted = false;

    isRunning = false

    stage: Entity

    /**
     * 根据配置注入 system.
     * @param initConfigs 
     */
     constructor( initConfigs: InitConfigInterface) {

        this.checkStarted( this.INIT_ERROR );

        this.initSystemList(initConfigs.systemConfig);

        this.stage = new Entity(this, {hadLoaded: true})
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
        this.systemList.forEach(system => {
            system.destroy()
        })
        this.emitor.emit(GEEvents.DESTROY)
    }

    findEntities<C extends AllComponentType>(componnetType: C ): Entity[]  {
       return this.getSystem(EntityManagerSystem)?.findEntities(componnetType)||[]
    }
    
    findEntity<C extends AllComponentType>(componnetType: C ): Entity|undefined  {
        return this.getSystem(EntityManagerSystem)?.findEntity(componnetType)
    }

    findComponents<C extends AllComponentType>(componnetType: C ): ComponentInstance<C>[]  {
        const entities = this.getSystem(EntityManagerSystem)?.findEntities(componnetType)||[]
        return entities.map(entity => entity.getComponents(componnetType)).flat(2) as ComponentInstance<C>[]
    }

    findComponent<C extends AllComponentType>(componnetType: C ): ComponentInstance<C>|undefined  {
        return this.getSystem(EntityManagerSystem)?.findEntity(componnetType)?.getComponent(componnetType)
    }

    /**
     * 注入一个 systemConfig.
     * @param systemConfig 
     */
    initSystem( systemConfig: SystemConfig<any>){
        this.checkStarted( this.INIT_ERROR );
        const system = new systemConfig.systemConstructor(this, systemConfig.config);
        this.systemList.push(system)
        this.emitor.emit(GEEvents.ADD_SYSTEM, system)
    };


    private  checkStarted(errorMessage: Error){
        if( this.hasStarted){
            throw errorMessage;
        }
    }

    private  initSystemList(systemConfig: Array<SystemConfig<any>>) {

        for(let i = 0; i <systemConfig.length; i++){
            this.initSystem( systemConfig[i] );
        }
    }

    /**
     * 获取实例化的 system.
     * @param systemConstructor 
     */
    getSystem<C extends AbstractSystemConstructor<any[]>>(systemConstructor: C): undefined|InstanceType<C> {
        for(let i=0; i<this.systemList.length; i++){
            if(this.systemList[i] instanceof systemConstructor){
                return this.systemList[i] as InstanceType<C>
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

    craeteObj(transformProps: Partial<TransformProps>, options?: Omit<EntityOptions, 'hadLoaded'>): Entity{
        const obj = new Entity(this, {hadLoaded: false, ...options})
        obj.addComponent(Transform, transformProps)
        this.sendMessage( GEEvents.ADD_ENTITY, this.stage );
        return obj
    }

}
