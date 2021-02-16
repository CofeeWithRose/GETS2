import GameObjectManager from "../managers/gameobject/implement/GameObjectManager";
import InputManager from "../managers/input/implement/InputManager";
import TimerManager from "../managers/timer/implement/TimerManager";
import TaskManager from "../managers/task/implemet/TaskManager";
import TaskConig from "./TaskConig";
import { InitConfigInterface } from "../core/interface/InitConfigInterface";

export const config: InitConfigInterface =   {

    managerInfoArray:[
        {
            manager: TaskManager,
            config: TaskConig,
        },
        {
            manager: TimerManager,
            config: {},
        },
        {
            manager: InputManager,
            config: {},
        },
        {
            manager: GameObjectManager,
            config: {},
        },
    ],
    
}
