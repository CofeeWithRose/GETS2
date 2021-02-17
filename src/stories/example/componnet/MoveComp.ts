import {
  Animation, Position2DComponent, Render2DComp,
  AbstractComponent, InputManager, KeyBoard 
} from 'ge'
export class MoveController extends AbstractComponent {
  
  protected input: InputManager

  protected position: Position2DComponent

  protected anim: Animation

  protected render: Render2DComp

  awake = () => {
    this.input = this.getManager(InputManager)
    this.position = this.GameObject.getComponent(Position2DComponent)
    this.anim = this.GameObject.getComponent(Animation)
  }

  update = () => {
   
    if(this.position && this.input.isKeyDown(KeyBoard.d, KeyBoard.D)){
      this.position.Value = { x: this.position.Value.x +1, y: this.position.Value.y }
    }
    if(this.position && this.input.isKeyDown(KeyBoard.a, KeyBoard.A)) {
      this.position.Value = { x: this.position.Value.x - 1, y: this.position.Value.y }
    }

    if(this.input.isKeyDown(KeyBoard.D, KeyBoard.d, KeyBoard.a, KeyBoard.A)){
      this.anim.play('run')
    }

    if(this.input.keyUp(KeyBoard.D, KeyBoard.d, KeyBoard.a, KeyBoard.A)){
      this.anim.play('stand')
    }


  }

}