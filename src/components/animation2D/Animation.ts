import { FunComponent } from "../../core/interface/AbstractComponentInterface";
import { Renderer } from "../../systems/Renderer/implement/Renderer";
import {TimerSystem} from "../../systems/timer/implement/TimerSystem";
import { Render2DComp, Render2DCompInfer } from "../render2D/implement/Render2DComp";


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

  let timer: TimerSystem
let render: Render2DCompInfer| undefined
  obj.regist('start', async () => {
      const renderer = ge.getSystem(Renderer)
      async function _loadSource(name: string, info: AnimationInfo) {
        const sourceIdList = await Promise.all(info.sourceList.map(  ({url}) =>  renderer.loadSource(url) ) )
        sourceList[name] = sourceIdList
      }
      timer = ge.getSystem(TimerSystem)
      await Promise.all( Object.keys( animationInfo ).map( animName => _loadSource(animName, animationInfo[animName]) ) )
      render = obj.getComponent(Render2DComp)

      

    
  })

  function _updateAnim(){

    const { animationName, isLoop, startPlayTime } = curPalyingState
    const _animationInfo = animationInfo[animationName]
    const _sourceList = sourceList[animationName]
    const curTime = (timer.StartFromNow - startPlayTime)%_animationInfo.duration
    const index = Math.floor((curTime/_animationInfo.duration)*_sourceList.length)
    
    if(_lastIndex !==index || _lastAnimationName !==animationName) {
      _lastIndex = index
      _lastAnimationName = animationName
      render.setSourceId(_sourceList[index])
    }

    if(index === _sourceList.length -1&& !isLoop) {
      curPalyingState.isPlaying = false
    }
  }
  obj.regist('update', () => {
    if(curPalyingState.isPlaying) _updateAnim()
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