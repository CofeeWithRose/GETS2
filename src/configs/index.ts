import GameObjectManager from "../managers/gameobject/implement/GameObjectManager";
import {InputManager} from "../managers/input/implement/InputManager";
import {TimerManager} from "../managers/timer/implement/TimerManager";
import TaskManager from "../managers/task/implemet/TaskManager";
import {taskConig} from "./TaskConig";
import { InitConfigInterface, ManagerInfo } from "../core/interface/InitConfigInterface";
import { Renderer } from "../managers/Renderer/implement/Renderer";
import { HitTester, HitGroup } from "../managers/HitTester";
import { HIT_TEST_GROUP } from "../managers/HitTester/infer";
import { Fps } from "../managers/Fps";

export const createConfig = (
  canvas: HTMLCanvasElement, 
  hitGroup: HitGroup[]= [ {groupA: HIT_TEST_GROUP.A, groupB: HIT_TEST_GROUP.B} ],
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
            config: {},
        },
        {
            manager: GameObjectManager,
            config: {},
        } as ManagerInfo<typeof GameObjectManager>,
        {
          manager: HitTester,
          config: hitGroup,
        } as ManagerInfo<typeof HitTester>,
        {
          manager: Renderer,
          config: { canvas, maxSize: 25000 },
        } as ManagerInfo<typeof Renderer>,
        {
          manager: Fps,
          config: {}
        }
    ],
    
})
