
export { HitResult, MoveInfo } from "./managers/HitTester";

export { GE } from "./core/implement/GE";
export { createConfig } from './configs'
export {InitConfigInterface} from "./core/interface/InitConfigInterface";
export {GameObject} from "./managers/gameobject/implement/data/GameObject";

export { InputManager } from "./managers/input/implement/InputManager";
export { KeyBoard } from "./managers/input/interface/data/enum";

export { AbstractComponent } from "./core/implement/AbstractComponent";
export { Render2DComp } from './components/render2D/implement/Render2DComp'
export * from './components/animation2D/Animation'
export { Transform, Vec2 } from './components/Transform'

export * from './components/HitTest'
export {HIT_TEST_GROUP, } from './managers/HitTester/infer'
export { TimerManager} from "./managers/timer/implement/TimerManager";

export { Fps } from './managers/Fps'

import  AbstractComponentLoader from './core/implement/AbstractComponentLoader'


export { AbstractComponentLoader }

