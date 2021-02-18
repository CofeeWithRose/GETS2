import {
  Animation, Render2DComp, Transform,
  AbstractComponent, InputManager, KeyBoard 
} from 'ge'
import TimerManager from '../../../managers/timer/implement/TimerManager'
export class MoveController extends AbstractComponent {
  
  protected input: InputManager

  protected transform: Transform

  protected anim: Animation

  protected render: Render2DComp

  protected left: KeyBoard[]

  protected right: KeyBoard[]

  protected timer: TimerManager

  protected speed: number

  init = (
    left: KeyBoard[]=[KeyBoard.d, KeyBoard.D], 
    right: KeyBoard[]=[KeyBoard.a, KeyBoard.A],
    speed = 150
  ) => {
    this.left = left
    this.right = right
    this.speed = speed
  }

  start = () => {
    this.input = this.getManager(InputManager)
    this.transform = this.GameObject.getComponent(Transform)
    this.anim = this.GameObject.getComponent(Animation)
    this.timer = this.getManager(TimerManager)
  }

  update = () => {
    const deltaTime = this.timer.DealTime
    const position = this.transform?.getPosition()
    const rotation = this.transform?.getRotation()
    const scale = this.transform?.getScale()
    if(position && this.input.isKeyDown(...this.left)){
      this.transform.setPosition({
         x: position.x + this.speed * deltaTime, y: position.y 
      })
      // console.log('d')
      // this.transform.setRotation(rotation+1)

      this.transform.setScale({ x: -1, y: 1 })
      this.anim.play('run')
    }

    if(this.transform && this.input.isKeyDown(...this.right)) {
      this.transform.setPosition ({
         x: position.x - this.speed * deltaTime, y: position.y 
      })
      this.transform.setScale({ x: 1, y: 1})
      this.anim.play('run')
    }

    if(this.input.keyUp(KeyBoard.D, KeyBoard.d, KeyBoard.a, KeyBoard.A)){
      this.anim.play('stand')
    }

  }

}