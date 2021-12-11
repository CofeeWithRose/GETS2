import EntityManagerSystem  from './systems/entity/implement/EntityManagerSystem'

export { GE } from "./core/implement/GE";
export { createConfig } from './configs'
export {InitConfigInterface} from "./core/interface/InitConfigInterface";
export {Entity} from "./systems/entity/implement/data/Entity";
export { AbstractComponent } from "./core/implement/AbstractComponent";
export type { FunComponent } from './core/interface/AbstractComponentInterface'
export { AbstractSystem } from './core/implement/AbstractSystem'
export { EntityManagerSystem }
export { getComponentTypeChain } from './core/util'
import TaskSystem  from './systems/task/implemet/TaskSystem'
export { TaskSystem }