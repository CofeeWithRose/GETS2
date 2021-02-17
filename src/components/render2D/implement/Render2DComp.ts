import {AbstractComponent} from "../../../core/implement/AbstractComponent";
import { Renderer } from "../../../managers/Renderer/implement/Renderer";
import { RendererInfer } from "../../../managers/Renderer/infer/Renderer";
import Vector2D from "../../../util/data/Vector2D";
import { Position2DComponent } from "../../position2D/implement/Position2DComponent";
import { Position2DComponentInterface, Vec2 } from "../../position2D/interface/Position2DComponentInterface";
import { Render2DCompInfer } from "../interface/render2DCompInfer";

export class Render2DComp extends AbstractComponent implements Render2DCompInfer {


  protected position: Position2DComponentInterface

  protected rotation: number = 0

  protected scale: Vector2D = new Vector2D(1, 1)

  protected renderer: RendererInfer

  protected sourceUrl: string

  protected sourceId: number

  protected spiritId: string

  setSourceId(sourceId: number){
    this.renderer.updateSpirit(this.spiritId,null, sourceId )
  }

  init = (sourceUrl: string) => {
    this.sourceUrl = sourceUrl
  }

  start = async () => {
    this.position = this.GameObject.getComponent(Position2DComponent)
    // setTimeout( () => console.log('getComponent..', this.GameObject), 1000)

    if(this.position) {

      this.position.on('positionChange', this.handlePositionChange)

      this.renderer = this.getManager(Renderer)

      if(this.sourceUrl) {
        this.sourceId = await this.renderer.loadSource(this.sourceUrl)
        this.spiritId =  this.renderer.craeteSpirit(this.sourceId, this.position.Value)
      }
      
    }
  }

  protected handlePositionChange = (newV: Vec2) => {
    if(this.spiritId) this.renderer.updateSpirit(this.spiritId, newV)
  }
  
  destory = () => {
    if(this.renderer) this.renderer.destroySpirit(this.spiritId)
    if(this.position) this.position.off('positionChange', this.handlePositionChange)
  }
}