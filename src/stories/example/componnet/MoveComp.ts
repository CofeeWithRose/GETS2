import { Animation } from "../../../components/animation2D/Animation";
import { Position2DComponent } from "../../../components/position2D/implement/Position2DComponent";
import { Position2DComponentInterface } from "../../../components/position2D/interface/Position2DComponentInterface";
import { AbstractComponent } from "../../../core/implement/AbstractComponent";
import InputManager from "../../../managers/input/implement/InputManager";
import { KeyBoard } from "../../../managers/input/interface/data/enum";
import InputManagerInterface from "../../../managers/input/interface/InputManagerInterface";

export class MoveController extends AbstractComponent {
  
  protected input: InputManagerInterface

  protected position: Position2DComponentInterface

  protected anim: Animation

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