import  AbstractComponentLoader from './core/implement/AbstractComponentLoader'
import EntityManagerSystem  from './managers/entity/implement/EntityManagerSystem'

export { GE } from "./core/implement/GE";
export { createConfig } from './configs'
export {InitConfigInterface} from "./core/interface/InitConfigInterface";
export {GameObject} from "./managers/entity/implement/data/GameObject";
export { InputSystem } from "./managers/input/implement/InputSystem";
export { KeyBoard } from "./managers/input/interface/data/enum";
export { AbstractComponent } from "./core/implement/AbstractComponent";
export { Render2DComp, Render2DCompInfer } from './components/render2D/implement/Render2DComp'
export * from './components/animation2D/Animation'
export { Transform, Vec2, TransformInfer } from './components/Transform'
export { TimerManager} from "./managers/timer/implement/TimerManager";
export { Fps } from './managers/Fps'
export type { FunComponent } from './core/interface/AbstractComponentInterface'
export { AbstractSystem } from './core/implement/AbstractSystem'
export { AbstractComponentLoader, EntityManagerSystem }

