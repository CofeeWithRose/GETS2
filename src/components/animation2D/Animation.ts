import { FunComponent } from "../../core/interface/AbstractComponentInterface";
import { AbstractComponent } from "../../core/implement/AbstractComponent";
import { Renderer } from "../../managers/Renderer/implement/Renderer";
import {TimerManager} from "../../managers/timer/implement/TimerManager";
import { Render2DComp } from "../render2D/implement/Render2DComp";
import { Vec2 } from "../Transform";


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

// export class Animation extends AbstractComponent {
  
//   protected render: Render2DComp

//   protected renderer: Renderer

//   protected timer: TimerManager

//   protected animationInfo: AnimConfig

//   protected sourceList: { [animationName: string]: number[] }= {}

//   protected lastIndex = -1

//   protected lastAnimationName: string


//   protected curPalyingState: PalyingState


//   init = (animationInfo: { [animationName: string]: AnimationInfo }) => {
//     this.animationInfo = animationInfo
//   }

//   start = async () => {

//     this.renderer = this.getManager(Renderer)
//     this.timer = this.getManager(TimerManager)
//     await Promise.all( Object.keys( this.animationInfo ).map( animName => this.loadSource(animName, this.animationInfo[animName]) ) )
   
//     this.render = this.GameObject.getComponent(Render2DComp)
    
//   }

//   protected async loadSource(name: string, info: AnimationInfo) {
//     const sourceIdList = await Promise.all(info.sourceList.map(  ({url}) =>  this.renderer.loadSource(url) ) )
//     this.sourceList[name] = sourceIdList
//   }

//   update = () => {
//     if(this.curPalyingState?.isPlaying) this.updateAnim()
//   }


//   play(animName: string, isLoop=true) {
//     const {animationName, isPlaying} = this.curPalyingState||{}

//     if(isPlaying && animationName === animName) return

//     if(this.sourceList[animName]){
//       this.curPalyingState = {
//         isLoop,
//         animationName: animName as string,
//         startPlayTime: this.timer.StartFromNow,
//         isPlaying: true
//       }
//     }
//   }

//   stop(){
//     this.curPalyingState = null
//     this.lastIndex = -1
//   }


//   protected updateAnim(){
//     const { animationName, isLoop, startPlayTime } = this.curPalyingState
//     const animationInfo = this.animationInfo[animationName]
//     const sourceList = this.sourceList[animationName]
//     const curTime = (this.timer.StartFromNow - startPlayTime)%animationInfo.duration
//     const index = Math.floor((curTime/animationInfo.duration)*sourceList.length)
    
//     if(this.lastIndex !==index || this.lastAnimationName !==animationName) {
//       this.lastIndex = index
//       this.lastAnimationName = animationName
//       // console.log('animationName',animationName, index)
//       this.render.setSourceId(sourceList[index])
//     }

//     if(index === sourceList.length -1&& !isLoop) {
//       this.curPalyingState.isPlaying = false
//     }
//   }

  
 

// }

export interface AnimationInfer {
  play(animName: string, isLoop?: boolean): void
  stop(): void
}

export const Animation: FunComponent<AnimationInfer> = function AnimationFun(
  ge, obj, animationInfo: { [animationName: string]: AnimationInfo }
) {

  const sourceList: { [animationName: string]: number[] } = {}
  
 

  const curPalyingState: PalyingState = { 
    isPlaying: false, animationName: '',
    isLoop: false, startPlayTime: 0,
  }

  let _lastIndex = -1;

  let _lastAnimationName = ''

  let timer: TimerManager

  obj.regist('start', async () => {
      const renderer = ge.getManager(Renderer)
      async function _loadSource(name: string, info: AnimationInfo) {
        const sourceIdList = await Promise.all(info.sourceList.map(  ({url}) =>  renderer.loadSource(url) ) )
        sourceList[name] = sourceIdList
      }
      timer = ge.getManager(TimerManager)
      await Promise.all( Object.keys( animationInfo ).map( animName => _loadSource(animName, animationInfo[animName]) ) )
      const render = obj.getComponent(Render2DComp)

      function _updateAnim(){

        const { animationName, isLoop, startPlayTime } = curPalyingState
        const _animationInfo = animationInfo[animationName]
        const _sourceList = sourceList[animationName]
        const curTime = (timer.StartFromNow - startPlayTime)%_animationInfo.duration
        const index = Math.floor((curTime/_animationInfo.duration)*_sourceList.length)
        
        if(_lastIndex !==index || _lastAnimationName !==animationName) {
          _lastIndex = index
          _lastAnimationName = animationName
          // console.log('animationName',animationName, index)
          render.setSourceId(_sourceList[index])
        }
    
        if(index === _sourceList.length -1&& !isLoop) {
          curPalyingState.isPlaying = false
        }
      }

      obj.regist('update', () => {
        if(curPalyingState.isPlaying) _updateAnim()
      })
  })

  


  function play(animName: string, isLoop=true) {
    const {animationName, isPlaying} = curPalyingState||{}

    if(isPlaying && animationName === animName) return

    if(sourceList[animName]){
      curPalyingState.isLoop = isLoop
      curPalyingState.animationName = animName
      curPalyingState.startPlayTime = timer.StartFromNow
      curPalyingState.isPlaying = true
    }
  }

  function stop(){
    curPalyingState.isPlaying = false
    _lastIndex = -1
  }


  


  
  return {
    play,
    stop,
  }
}