import GameObjectManager from "../managers/gameobject/implement/GameObjectManager";
import {InputManager} from "../managers/input/implement/InputManager";
import TimerManager from "../managers/timer/implement/TimerManager";
import TaskManager from "../managers/task/implemet/TaskManager";
import {taskConig} from "./TaskConig";
import { InitConfigInterface, ManagerInfo } from "../core/interface/InitConfigInterface";
import { Renderer } from "../managers/Renderer/implement/Renderer";

export const createConfig = (canvas: HTMLCanvasElement): InitConfigInterface =>  ({

    managerInfoArray:[
        {
            manager: TaskManager,
            config: taskConig,
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
            manager: Renderer,
            config: { canvas, maxSize: 10 },
        } as ManagerInfo<typeof Renderer>,
        {
            manager: GameObjectManager,
            config: {},
        } as ManagerInfo<typeof GameObjectManager>,
    ],
    
})
