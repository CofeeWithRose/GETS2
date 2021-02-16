import { AbstractComponent } from "../../core/implement/AbstractComponent";
import { Vec2 } from "../position2D/interface/Position2DComponentInterface";
import { Render2DComp } from "../render2D/implement/Render2DComp";


export interface AnimationInfo {
  sourceList: SourceInfo[]
  duration: number
}

export interface SourceInfo {

  // percent?: number

  url: string

  // /**
  //  * 动画导致的位置变更， 如走路时，每帧移动的距离,正值表示左下.
  //  */
  // postitionOffset: Vec2

}

export class Animation extends AbstractComponent {
  
  protected render: Render2DComp

  protected animationInfo: AnimationInfo

  init = (animationInfo: AnimationInfo) => {
    this.animationInfo = animationInfo
  }

  awake = () => {
    this.render = this.GameObject.getComponent(Render2DComp)
  }

 

}