// import GEInterface from "../interface/GEInterface";
import InitConfigInterface, { ManagerInfo, ComponentInfo } from "../interface/InitConfigInterface";
import AbstractComponentInterface from "../interface/AbstractComponentInterface";
import AbstractManagerInterface from "../interface/AbstractManagerInterface";
import SimpleMap from "../../util/map/implement/SimpleMap";
import EventEmitor from "../../util/event/EventEmitor";
import { GEEvents, GEEventsMap } from "../../util/enums/GEEvent";
import { ManagerNameSpaces, ComponentNameSpace } from "../../util/enums/NameSpaces";
import AbstractComponent from "./AbstractComponent";
import AbstractComponentLoader from "./AbstractComponentLoader";


export  class GE {

    private static managerMap = new SimpleMap<ManagerNameSpaces, AbstractManagerInterface>();
    
    private static componentMap = new SimpleMap<ComponentNameSpace, typeof AbstractComponent>();

    private static emitor = new EventEmitor();

    private static INIT_ERROR = new Error( 'Init Error: Please init Before invoke start method !' ); 

    private static hasStarted = false;
    
    /**
     *启动.
     */
    static start(){
        this.emitor.emit(GEEvents.START);
        this.hasStarted = true;
    };

    /**
     * 暂停.
     */
    static pause(){
        this.emitor.emit(GEEvents.PAUSE);
    };

    /**
     * 根据配置注入 manager.
     * @param initConfigs 
     */
    static init( initConfigs: InitConfigInterface ) {

        this.checkStarted( this.INIT_ERROR );

        this.initManagers(initConfigs.managerInfoArray);

        this.initComponets( initConfigs.componentInfoArray);
     
    };

    /**
     * 注入一个 managerInfo.
     * @param managerInfo 
     */
    static initManager( managerInfo: ManagerInfo){

        this.checkStarted( this.INIT_ERROR );
        const manager = new managerInfo.manager(managerInfo.config);

        this.managerMap.set(managerInfo.managerNameSpace, manager);
    };

    /**
     * 注入一个 component.
     * @param componentInfo 
     */
    static initComponet( componentInfo: ComponentInfo) {
        
        this.checkStarted( this.INIT_ERROR );

        this.componentMap.set(componentInfo.componentNameSpace, componentInfo.componentClass);
    };

    private static checkStarted(errorMessage: Error){
        if( this.hasStarted){
            throw errorMessage;
        }
    }

    private static initComponets(componentInfoArray: Array<ComponentInfo>){
        componentInfoArray.map( componentInfo => {
            this.initComponet(componentInfo);
        } )
    };

    private static initManagers(managerInfos: Array<ManagerInfo>) {

        for(let i = 0; i <managerInfos.length; i++){
            this.initManager( managerInfos[i] );
        }
    }

    /**
     * 获取实例化的 manager.
     * @param managerNameSpace 
     */
    static getManager(managerNameSpace: ManagerNameSpaces): AbstractManagerInterface {

       return this.managerMap.get(managerNameSpace);
    };

    /**
     * 触发订阅的事件.
     * @param eventName 
     * @param message 
     */
    static sendMessage <T extends keyof GEEventsMap>( eventName: T, ...message: Parameters<GEEventsMap[T]> ) {
        this.emitor.emit(eventName, ...message);
    };

    /**
     * 订阅事件
     * @param eventName 
     * @param fun 
     */
    static subscribeMssage <T extends keyof GEEventsMap> (eventName: T, fun : GEEventsMap[T]) {
        this.emitor.addEventListener(eventName, fun);
    };


    /**
     * 取消事件订阅.
     * @param eventName 
     * @param fun 
     */
    static unsubscribeMssage (eventName: GEEvents, fun : Function) {
        this.emitor.removeEventListener(eventName, fun);
    };

    /**
     * 实例化组件.
     * @param componentNameSpace 
     */
    static instanceComponent(componentNameSpace: ComponentNameSpace): AbstractComponentInterface {
        return new (this.componentMap.get(componentNameSpace));;
    }

    /**
     * 实例化组件容器.
     * @param componentLoader 
     */
    static instanceComponentLoader(componentLoader: typeof AbstractComponentLoader): AbstractComponentLoader {
        return new componentLoader();
    } 

}
