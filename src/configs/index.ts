import EntityManagerSystem from "../systems/entity/implement/EntityManagerSystem";
import {TimerSystem} from "../systems/timer/implement/TimerSystem";
import TaskSystem from "../systems/task/implemet/TaskSystem";
import {taskConig} from "./TaskConig";
import { InitConfigInterface, SystemConfig } from "../core/interface/InitConfigInterface";
import { Fps } from "../systems/Fps";
import { Transformer } from "../systems/Transformer";

export const createConfig = (
  canvas: HTMLCanvasElement, 
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
