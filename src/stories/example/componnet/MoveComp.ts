import {
  Animation, AnimationInfer,
  Transform, TransformInfer,
  AbstractComponent, InputManager, KeyBoard,
  HitTest, Entity, Vec2, MoveInfo, TimerManager, 
} from 'ge'



export interface HitInfomation {
  self: MoveInfo,
  other: MoveInfo
}
export class MoveController extends AbstractComponent {
  
  protected input: InputManager

  protected transform: TransformInfer

  protected anim: AnimationInfer

  protected left: KeyBoard

  protected right: KeyBoard

  protected timer: TimerManager

  protected speed: number

  protected hitTest: HitTest

  protected v: Vec2 

  protected hitInfo: HitInfomation 

  protected position: Vec2

  init = (
    left: KeyBoard=KeyBoard.a,
    right: KeyBoard=KeyBoard.d, 
    speed = 150
  ) => {
    this.left = left
    this.right = right
    this.v = {x: 0, y: 0}
    this.speed = speed
  }

  start = () => {
    this.input = this.getManager(InputManager)
    this.transform = this.Entity.getComponent(Transform)
    this.anim = this.Entity.getComponent(Animation)
    this.timer = this.getManager(TimerManager)
    this.hitTest = this.Entity.getComponent(HitTest)
    this.hitTest && this.hitTest.on('hitting', this.handleHitting)
    this.position = this.transform.getPosition()
  }

  destory = ()  => {
    this.hitTest && this.hitTest.off('hitting', this.handleHitting)
  }

  protected handleHitting = (other: Entity, otherM: MoveInfo, selfM: MoveInfo) => {
      this.hitInfo = {
        self: selfM,
        other: otherM,
      }
  }



  update = () => {
    const deltaTime = this.timer.DealTime

    if(this.input.keyDown(this.left)){
       this.v.x = -this.speed,
      this.transform.setScale({ x: 1, y: 1 })
      this.anim.play('run')
    }

    if( this.input.keyDown(this.right)) {
      this.v.x = this.speed
      this.transform.setScale({ x: -1, y: 1})
      this.anim.play('run')
    }
    // console.log(this.input.isKeyUp(KeyBoard.a, KeyBoard.A))
    if( this.input.isKeyUp(this.left) && this.input.isKeyUp(this.right)){
      this.v.x = 0;
      this.v.y = 0
      this.anim.play('stand')
    }

    this.transform.setPosition(
      this.position.x + this.v.x * deltaTime, 
      this.position.y + this.v.y * deltaTime,
    )

    
    if(this.hitInfo){
      const {direction: otherDirection, deltaTime, position: otherPosition, size: otherSize } = this.hitInfo.other
      const { direction, position, size } = this.hitInfo.self
      const directionX = ((position.x - direction.x) - (otherPosition.x - otherDirection.x) ) > 0? -1: 1
      const dist = (otherSize.x + size.x) * 0.5 + Math.abs(directionX) * ((this.timer.DealTime/deltaTime)||1)
      this.transform.setPosition(
        otherPosition.x - directionX * dist,
        position.y,
      )
      this.hitInfo = null
    }
  }

  private handleUp(){
   
  }



}