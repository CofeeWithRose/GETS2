import {
  Animation, Render2DComp, Transform,
  AbstractComponent, InputManager, KeyBoard 
} from 'ge'
export class MoveController extends AbstractComponent {
  
  protected input: InputManager

  protected transform: Transform

  protected anim: Animation

  protected render: Render2DComp

  awake = () => {
    this.input = this.getManager(InputManager)
    this.transform = this.GameObject.getComponent(Transform)
    this.anim = this.GameObject.getComponent(Animation)
  }

  update = () => {
    const position = this.transform?.getPosition()
    const rotation = this.transform?.getRotation()
    const scale = this.transform?.getScale()
    if(position && this.input.isKeyDown(KeyBoard.d, KeyBoard.D)){
      // this.transform.setPosition({
      //    x: position.x + 3, y: position.y 
      // })
      console.log('d')
      this.transform.setRotation(rotation+1)

      this.transform.setScale({ x: scale.x + 0.01, y: 1 })
      
      

      this.anim.play('run')
    }
    if(this.transform && this.input.isKeyDown(KeyBoard.a, KeyBoard.A)) {
      // this.transform.setPosition ({
      //    x: position.x - 3, y: position.y 
      // })
      console.log('a')
      this.transform.setRotation(rotation - 1)

      this.transform.setScale({ x: scale.x - 0.01, y: 1})


      this.anim.play('run')
    }

    if(this.input.keyUp(KeyBoard.D, KeyBoard.d, KeyBoard.a, KeyBoard.A)){
      this.anim.play('stand')
    }

  }

}