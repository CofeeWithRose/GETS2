import GEInterface from "../interface/GEInterface";
import InitConfigInterface from "../interface/InitConfigInterface";
import { ComponentNameSpace } from "../interface/ComponentNameSpace";
import AbstractComponentInterface from "../interface/AbstractComponentInterface";
import { ManagerNameSpace } from "../interface/ManagerNameSpace";
import AbstractManagerInterface from "../interface/AbstractManagerInterface";
import SimpleMap from "../../util/map/implement/SimpleMap";

export default class GE implements GEInterface {

    private managerMap = new SimpleMap<ManagerNameSpace, AbstractManagerInterface>();
   
    start(){
       
    };
    
    pause(){
        
    };

    init( managerConfigs: Array<InitConfigInterface> ) {

        for(let i = 0; i <managerConfigs.length; i++){

            const cf = managerConfigs[i];

            const manager = new cf.manager(cf.config);

            this.managerMap.set(cf.managerNameSpace, manager);

        }
    };

    getManager(managerNameSpace: ManagerNameSpace): AbstractManagerInterface {

       return this.managerMap.get(managerNameSpace);
    };

    sendMessage( eventName: string, message: any ) {

    };

    instanceComponent(componentNameSpace: ComponentNameSpace): AbstractComponentInterface {
        return null;
    }

}

const core = new GE();

const cfs = [
    {
        managerNameSpace: ManagerNameSpace.RenderManager,

        manager : null,

        config: null,

    }
];

core.init(cfs);
