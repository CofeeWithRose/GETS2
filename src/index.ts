import  AbstractComponentLoader from './core/implement/AbstractComponentLoader'
import EntityManagerSystem  from './systems/entity/implement/EntityManagerSystem'

export { GE } from "./core/implement/GE";
export { createConfig } from './configs'
export {InitConfigInterface} from "./core/interface/InitConfigInterface";
export {Entity} from "./systems/entity/implement/data/Entity";
export { InputSystem } from "./systems/input/implement/InputSystem";
export { KeyBoard } from "./systems/input/interface/data/enum";
export { AbstractComponent } from "./core/implement/AbstractComponent";
// export { Render2DComp, Render2DCompInfer } from './components/render2D/implement/Render2DComp'
// export * from './components/animation2D/Animation'
export { Transform, Vec2, TransformInfer } from './components/Transform'
export { TimerSystem as TimerManager} from "./systems/timer/implement/TimerSystem";
export { Fps } from './systems/Fps'
export type { FunComponent } from './core/interface/AbstractComponentInterface'
export { AbstractSystem } from './core/implement/AbstractSystem'
export { AbstractComponentLoader, EntityManagerSystem }

