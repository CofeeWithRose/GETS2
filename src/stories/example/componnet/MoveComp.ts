import { Position2DComponent } from "../../../components/position2D/implement/Position2DComponent";
import { Position2DComponentInterface } from "../../../components/position2D/interface/Position2DComponentInterface";
import { AbstractComponent } from "../../../core/implement/AbstractComponent";
import InputManager from "../../../managers/input/implement/InputManager";
import { KeyBoard } from "../../../managers/input/interface/data/enum";
import InputManagerInterface from "../../../managers/input/interface/InputManagerInterface";

export class MoveController extends AbstractComponent {
  
  protected input: InputManagerInterface

  protected position: Position2DComponentInterface

  awake = () => {
    this.input = this.getManager(InputManager)
    this.position = this.GameObject.getComponent(Position2DComponent)
  }

  update = () => {
    if(this.position && this.input.isKeyDown(KeyBoard.d, KeyBoard.D)){
      this.position.Value = { x: this.position.Value.x +1, y: this.position.Value.y }
    }
    if(this.position && this.input.isKeyDown(KeyBoard.a, KeyBoard.A)) {
      this.position.Value = { x: this.position.Value.x - 1, y: this.position.Value.y }
    }
  }

}