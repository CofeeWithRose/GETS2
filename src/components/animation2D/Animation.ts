import { AbstractComponent } from "../../core/implement/AbstractComponent";
import { Renderer } from "../../managers/Renderer/implement/Renderer";
import TimerManager from "../../managers/timer/implement/TimerManager";
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

interface PalyingState {
  isPlaying: boolean
  startPlayTime: number
  animationName: string 
  isLoop: boolean
} 

export type AnimConfig  = { [animationName: string]: AnimationInfo }
export class Animation extends AbstractComponent {
  
  protected render: Render2DComp

  protected renderer: Renderer

  protected timer: TimerManager

  protected animationInfo: AnimConfig

  protected sourceList: { [animationName: string]: number[] }= {}

  protected lastIndex = -1

  protected lastAnimationName: string


  protected curPalyingState: PalyingState


  init = (animationInfo: { [animationName: string]: AnimationInfo }) => {
    this.animationInfo = animationInfo
  }

  awake = async () => {

    this.renderer = this.getManager(Renderer)
    this.timer = this.getManager(TimerManager)
    await Promise.all( Object.keys( this.animationInfo ).map( animName => this.loadSource(animName, this.animationInfo[animName]) ) )
   
    this.render = this.GameObject.getComponent(Render2DComp)
    
  }

  protected async loadSource(name: string, info: AnimationInfo) {
    const sourceIdList = await Promise.all(info.sourceList.map(  ({url}) =>  this.renderer.loadSource(url) ) )
    this.sourceList[name] = sourceIdList
  }

  update = () => {
    if(this.curPalyingState?.isPlaying) this.updateAnim()
  }


  play(animName: string, isLoop=true) {
    const {animationName, isPlaying} = this.curPalyingState||{}

    if(isPlaying && animationName === animName) return

    if(this.sourceList[animName]){
      this.curPalyingState = {
        isLoop,
        animationName: animName as string,
        startPlayTime: this.timer.StartFromNow,
        isPlaying: true
      }
    }
  }

  stop(){
    this.curPalyingState = null
    this.lastIndex = -1
  }


  protected updateAnim(){
    const { animationName, isLoop, startPlayTime } = this.curPalyingState
    const animationInfo = this.animationInfo[animationName]
    const sourceList = this.sourceList[animationName]
    const curTime = (this.timer.StartFromNow - startPlayTime)%animationInfo.duration
    const percent = curTime/animationInfo.duration
    const index = Math.floor(percent*sourceList.length)
    
    if(this.lastIndex !==index || this.lastAnimationName !==animationName) {
      this.lastIndex = index
      this.lastAnimationName = animationName
      this.render.setSourceId(sourceList[index])
      // console.log('animationName',animationName, index)
    }

    if(index === sourceList.length -1&& !isLoop) {
      this.curPalyingState.isPlaying = false
    }
  }

  
 

}