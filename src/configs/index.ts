import Position2DComponent from "../components/position2D/implement/Position2DComponent";
import { ComponentNameSpace, ManagerNameSpaces } from "../util/enums/NameSpaces";
import GameObjectManager from "../managers/gameobject/implement/GameObjectManager";
import InputManager from "../managers/input/implement/InputManager";
import TimerManager from "../managers/timer/implement/TimerManager";
import TaskManager from "../managers/task/implemet/TaskManager";
import TaskConig from "./TaskConig";

export const config =   {

    managerInfoArray:[
        {
            managerNameSpace: ManagerNameSpaces.TaskManager,
            manager: TaskManager,
            config: TaskConig,
        },
        {
            managerNameSpace: ManagerNameSpaces.TimerManager,
            manager: TimerManager,
            config: {},
        },
        {
            managerNameSpace: ManagerNameSpaces.InputManager,
            manager: InputManager,
            config: {},
        },
        {
            managerNameSpace: ManagerNameSpaces.GameObjectManager,
            manager: GameObjectManager,
            config: {},
        },
    ],
    componentInfoArray:[
        {
            componentNameSpace: ComponentNameSpace.POSITION_2D,

            componentClass: Position2DComponent,
        }
    ],
}
