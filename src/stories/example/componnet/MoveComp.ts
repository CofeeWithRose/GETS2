import {
  Animation, Render2DComp, Transform,
  AbstractComponent, InputManager, KeyBoard 
} from 'ge'
import { HitTest } from '../../../components/HitTest'
import { Vec2 } from '../../../components/Transform'
import { GameObject } from '../../../managers/gameobject/implement/data/GameObject'
import { HitResult, MoveInfo } from '../../../managers/HitTester'
import TimerManager from '../../../managers/timer/implement/TimerManager'


export interface HitInfomation {
  self: MoveInfo,
  other: MoveInfo
}
export class MoveController extends AbstractComponent {
  
  protected input: InputManager

  protected transform: Transform

  protected anim: Animation

  protected render: Render2DComp

  protected left: KeyBoard[]

  protected right: KeyBoard[]

  protected timer: TimerManager

  protected speed: number

  protected hitTest: HitTest

  protected v: Vec2 

  protected hitInfo: HitInfomation 

  init = (
    left: KeyBoard[]=[KeyBoard.a, KeyBoard.A],
    right: KeyBoard[]=[KeyBoard.d, KeyBoard.D], 
    speed = 150
  ) => {
    this.left = left
    this.right = right
    this.v = {x: 0, y: 0}
    this.speed = speed
  }

  start = () => {
    this.input = this.getManager(InputManager)
    this.transform = this.GameObject.getComponent(Transform)
    this.anim = this.GameObject.getComponent(Animation)
    this.timer = this.getManager(TimerManager)
    this.hitTest = this.GameObject.getComponent(HitTest)
    this.hitTest && this.hitTest.on('hitting', this.handleHitting)
  }

  destory = ()  => {
    this.hitTest && this.hitTest.off('hitting', this.handleHitting)
  }

  protected handleHitting = (other: GameObject, otherM: MoveInfo, selfM: MoveInfo) => {
      this.hitInfo = {
        self: selfM,
        other: otherM,
      }
  }



  update = () => {
    const deltaTime = this.timer.DealTime
    const position = this.transform?.getPosition()
    // const rotation = this.transform?.getRotation()
    // const scale = this.transform?.getScale()
    if(this.v.x|| this.v.y) this.transform.setPosition({
      x: position.x + this.v.x * deltaTime, 
      y: position.y + this.v.y * deltaTime,
    })

    if(this.input.isKeyDown(...this.left)){
       this.v = {
        x: -this.speed,
        y: 0
      }
      this.transform.setScale({ x: 1, y: 1 })
      this.anim.play('run')
    }

    if( this.input.isKeyDown(...this.right)) {
      this.v = {
        x: this.speed,
        y: 0
      }
      this.transform.setScale({ x: -1, y: 1})
      this.anim.play('run')
    }

    if( this.input.keyUp(...this.left, ...this.right)){
      this.v = {
        x: 0,
        y: 0
      }
      this.anim.play('stand')
    }
    if(this.hitInfo){
      const {direction: otherDirection, deltaTime, position: otherPosition, size: otherSize } = this.hitInfo.other
      const { direction, position, size } = this.hitInfo.self
      const directionX = ((position.x - direction.x) - (otherPosition.x - otherDirection.x) ) > 0? -1: 1
      const dist = (otherSize.x + size.x) * 0.5 + Math.abs(directionX) * ((this.timer.DealTime/deltaTime)||1)
      this.transform.setPosition({
        x: otherPosition.x - directionX * dist,
        y: position.y,
      })
      this.hitInfo = null
    }
  }



}