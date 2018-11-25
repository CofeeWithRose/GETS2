import AbstractMnager from "../../../core/implement/AbstractManager";
import TaskManagerInterface from "../interface/TaskManagerInterface";
import { injectManagerNameSpace } from "../../../util/decorators/NameSpace";
import { ManagerNameSpaces } from "../../../util/enums/NameSpaces";
import TaskMnagerConfigInterface from "../interface/config/TaskMnagerConfigInterface";
import { GEEvents } from "../../../util/enums/GEEvent";
import AbstractComponentInterface from "../../../core/interface/AbstractComponentInterface";

@injectManagerNameSpace(ManagerNameSpaces.TaskManager)
export default class TaskManager extends AbstractMnager implements TaskManagerInterface {

    constructor(config: TaskMnagerConfigInterface) {
        super(config);
        this.addGEEvemtListener(GEEvents.START, this.onStart);
        this.addGEEvemtListener(GEEvents.PAUSE, this.onPause);
        this.addGEEvemtListener(GEEvents.ADD_COMPONENT, this.onAddComponnet);
        this.addGEEvemtListener(GEEvents.REMOVE_COMPONENT, this.onRemoveComponent);

    };

    private initConfig(config: TaskMnagerConfigInterface) {

    };

    private onAddComponnet = (component: AbstractComponentInterface) => {

    };

    private onRemoveComponent = (component: AbstractComponentInterface) => {

    };

    private onStart = () => {

    };

    private onPause = () => {

    };

}
