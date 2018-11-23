// import GEInterface from "../interface/GEInterface";
import InitConfigInterface, { ManagerInfo, ComponentInfo } from "../interface/InitConfigInterface";
import AbstractComponentInterface from "../interface/AbstractComponentInterface";
import AbstractManagerInterface from "../interface/AbstractManagerInterface";
import SimpleMap from "../../util/map/implement/SimpleMap";
import EventEmitor from "../../util/event/EventEmitor";
import { GEEvents } from "../../util/enums/GEEvent";
import { ManagerNameSpaces, ComponentNameSpace } from "../../util/enums/NameSpaces";
import AbstractComponent from "./AbstractComponent";
import AbstractComponentLoader from "./AbstractComponentLoader";


export default class GE {

    private static managerMap = new SimpleMap<ManagerNameSpaces, AbstractManagerInterface>();
    
    private static componentMap = new SimpleMap<ComponentNameSpace, typeof AbstractComponent>();

    private static emitor = new EventEmitor();
    
    /**
     *启动.
     */
    static start(){
        this.emitor.emit(GEEvents.START);
    };

    /**
     * 暂停.
     */
    static pause(){
        this.emitor.emit(GEEvents.PAUSE);
    };

    /**
     * 初始化配置的 manager.
     * @param initConfigs 
     */
    static init( initConfigs: InitConfigInterface ) {

        this.initManager(initConfigs.managerInfoArray);

        this.initComponet( initConfigs.componentInfoArray);
     
    };

    private static initComponet(componentInfoArray: Array<ComponentInfo>){
        componentInfoArray.map( componentInfo => {
            this.componentMap.set(componentInfo.componentNameSpace, componentInfo.componentClass);
        } )
    };

    private static initManager(managerInfos: Array<ManagerInfo>){

        for(let i = 0; i <managerInfos.length; i++){

            const cf = managerInfos[i];

            const manager = new cf.manager(cf.config);

            this.managerMap.set(cf.managerNameSpace, manager);

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
    static sendMessage( eventName: GEEvents, ...message: Array<any> ) {
        this.emitor.emit(eventName, ...message);
    };

    /**
     * 订阅事件
     * @param eventName 
     * @param fun 
     */
    static subscribeMssage (eventName: GEEvents, fun : Function) {
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
        const component = new (this.componentMap.get(componentNameSpace));
        this.emitor.emit(GEEvents.INSTANCE_COMPONENT, component);
        return component;
    }

    /**
     * 实例化组件容器.
     * @param componentLoader 
     */
    static instanceComponentLoader(componentLoader: typeof AbstractComponentLoader): AbstractComponentLoader {
        const instance = new componentLoader();
        this.emitor.emit( GEEvents.INSTANCE_COMPONENT_LOADER, instance);
        return instance;
    } 

}
