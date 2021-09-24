import GameObjectManager from "../managers/gameobject/implement/GameObjectManager";
import {InputManager} from "../managers/input/implement/InputManager";
import {TimerManager} from "../managers/timer/implement/TimerManager";
import TaskManager from "../managers/task/implemet/TaskManager";
import {taskConig} from "./TaskConig";
import { InitConfigInterface, ManagerInfo } from "../core/interface/InitConfigInterface";
import { Renderer } from "../managers/Renderer/implement/Renderer";
import { Fps } from "../managers/Fps";
import { Transformer } from "../managers/Transformer";
import { KeyBoard } from "src/managers/input/interface/data/enum";

export const createConfig = (
  canvas: HTMLCanvasElement, 
  {defaultKeys}: {defaultKeys: KeyBoard[]}
): InitConfigInterface =>  ({

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
            config: {defaultKeys},
        },
        {
            manager: GameObjectManager,
            config: {},
        } as ManagerInfo<typeof GameObjectManager>,
        {
          manager: Transformer,
          config: {},
        },
        {
          manager: Fps,
          config: {}
        }
    ],
    
})
