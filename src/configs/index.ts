import EntityManagerSystem from "../systems/entity/implement/EntityManagerSystem";
import TaskSystem from "../systems/task/implemet/TaskSystem";
import {taskConig} from "./TaskConig";
import { InitConfigInterface, SystemConfig } from "../core/interface/InitConfigInterface";

export const createConfig = (): InitConfigInterface =>  ({
    systemConfig:[
        {
            systemConstructor: TaskSystem,
            config: taskConig,
        },
        {
            systemConstructor: EntityManagerSystem,
            config: {},
        } as SystemConfig<typeof EntityManagerSystem>,
    ],
    
})
