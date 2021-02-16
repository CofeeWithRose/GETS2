import {AbstractComponent} from "../../../core/implement/AbstractComponent";
import { Position2DComponent } from "../../position2D/implement/Position2DComponent";
import { Position2DComponentInterface, Vec2 } from "../../position2D/interface/Position2DComponentInterface";
import { Render2DCompInfer } from "../interface/render2DCompInfer";

export class Render2DComp extends AbstractComponent implements Render2DCompInfer {


  protected position: Position2DComponentInterface

  awake(){
      this.position = this.GameObject.getComponent(Position2DComponent)
      if(this.position) this.position.on('positionChange', this.handlePositionChange)
      // this.getManager(Render)
      console.log('awake')
  }

  protected handlePositionChange = (old:Vec2, newV: Vec2) => {
    console.log('position change', newV)
  }
  
  destory(){
    console.log('destory')
    if(this.position) this.position.off('positionChange', this.handlePositionChange)
  }
}