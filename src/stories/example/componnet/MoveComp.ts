import {
  Animation, Render2DComp, Transform,
  AbstractComponent, InputManager, KeyBoard 
} from 'ge'
export class MoveController extends AbstractComponent {
  
  protected input: InputManager

  protected transform: Transform

  protected anim: Animation

  protected render: Render2DComp

  protected left: KeyBoard[]

  protected right: KeyBoard[]

  init = (
    left: KeyBoard[]=[KeyBoard.d, KeyBoard.D], 
    right: KeyBoard[]=[KeyBoard.a, KeyBoard.A]
  ) => {
    this.left = left
    this.right = right
  }

  start = () => {
    this.input = this.getManager(InputManager)
    this.transform = this.GameObject.getComponent(Transform)
    this.anim = this.GameObject.getComponent(Animation)
  }

  update = () => {
    const position = this.transform?.getPosition()
    const rotation = this.transform?.getRotation()
    const scale = this.transform?.getScale()
    if(position && this.input.isKeyDown(...this.left)){
      this.transform.setPosition({
         x: position.x + 3, y: position.y 
      })
      // console.log('d')
      // this.transform.setRotation(rotation+1)

      this.transform.setScale({ x: -1, y: 1 })
      

      this.anim.play('run')
    }
    if(this.transform && this.input.isKeyDown(...this.right)) {
      this.transform.setPosition ({
         x: position.x - 3, y: position.y 
      })
      // console.log('a')
      // this.transform.setRotation(rotation - 1)

      this.transform.setScale({ x: 1, y: 1})


      this.anim.play('run')
    }

    if(this.input.keyUp(KeyBoard.D, KeyBoard.d, KeyBoard.a, KeyBoard.A)){
      this.anim.play('stand')
    }

  }

}