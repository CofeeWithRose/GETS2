import EntityManagerSystem from "../systems/entity/implement/EntityManagerSystem";
import {InputSystem} from "../systems/input/implement/InputSystem";
import {TimerSystem} from "../systems/timer/implement/TimerSystem";
import TaskSystem from "../systems/task/implemet/TaskSystem";
import {taskConig} from "./TaskConig";
import { InitConfigInterface, SystemConfig } from "../core/interface/InitConfigInterface";
import { Fps } from "../systems/Fps";
import { Transformer } from "../systems/Transformer";
import { KeyBoard } from "src/systems/input/interface/data/enum";

export const createConfig = (
  canvas: HTMLCanvasElement, 
  {defaultKeys}: {defaultKeys: KeyBoard[]}
): InitConfigInterface =>  ({

    systemConfig:[
        {
            systemConstructor: TaskSystem,
            config: taskConig,
        },
     
        {
            systemConstructor: TimerSystem,
            config: {},
        },
        {
            systemConstructor: InputSystem,
            config: {defaultKeys},
        },
        {
            systemConstructor: EntityManagerSystem,
            config: {},
        } as SystemConfig<typeof EntityManagerSystem>,
        {
          systemConstructor: Transformer,
          config: {},
        },
        {
          systemConstructor: Fps,
          config: {}
        }
    ],
    
})
