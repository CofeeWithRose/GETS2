import  AbstractComponentLoader from './core/implement/AbstractComponentLoader'
import EntityManagerSystem  from './systems/entity/implement/EntityManagerSystem'

export { GE } from "./core/implement/GE";
export { createConfig } from './configs'
export {InitConfigInterface} from "./core/interface/InitConfigInterface";
export {Entity} from "./systems/entity/implement/data/Entity";
export { AbstractComponent } from "./core/implement/AbstractComponent";
// export { Render2DComp, Render2DCompInfer } from './components/render2D/implement/Render2DComp'
// export * from './components/animation2D/Animation'
export { Transform, Vec2, TransformInfer } from './components/Transform'
export type { FunComponent } from './core/interface/AbstractComponentInterface'
export { AbstractSystem } from './core/implement/AbstractSystem'
export { AbstractComponentLoader, EntityManagerSystem }
export { getComponentTypeChain } from './core/util'
