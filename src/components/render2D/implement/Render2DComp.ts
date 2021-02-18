import {AbstractComponent} from "../../../core/implement/AbstractComponent";
import { Renderer } from "../../../managers/Renderer/implement/Renderer";
import { Transform, Vec2 } from "../../Transform";
import { Render2DCompInfer } from "../interface/render2DCompInfer";

export class Render2DComp extends AbstractComponent implements Render2DCompInfer {


  protected tansform: Transform


  protected renderer: Renderer

  protected sourceUrl: string

  protected sourceId: number

  protected spiritId: string

  protected isShowBorder = false


  init = (sourceUrl: string) => {
    this.sourceUrl = sourceUrl
  }

  start = async () => {
    this.tansform = this.GameObject.getComponent(Transform)

    if(this.tansform) {

      this.tansform.on('positionChange', this.handlePositionChange)

      this.tansform.on('rotationChange', this.handleRotationChange)

      this.tansform.on('scaleChange', this.handleScaleChange)

      this.renderer = this.getManager(Renderer)

      if(this.sourceUrl) {
        this.sourceId = await this.renderer.loadSource(this.sourceUrl)
        this.spiritId =  this.renderer.craeteSpirit(this.sourceId, {
          position: this.tansform.getPosition(),
          scale: this.tansform.getScale(),
          rotation: this.tansform.getRotation(),
        })
      }
      
    }
  }

  protected handlePositionChange = (newV: Vec2) => {
    if(this.spiritId) this.renderer.updateSpirit(this.spiritId, {position: newV})
  }

  protected handleScaleChange = (scale: Vec2) => {
    if(this.spiritId) this.renderer.updateSpirit(this.spiritId, {scale})
  }

  protected handleRotationChange = (rotation: number) => {
    if(this.spiritId) this.renderer.updateSpirit(this.spiritId, {rotation})
  }

  setSourceId(sourceId: number){
    this.sourceId = sourceId
    this.renderer.updateSpirit(this.spiritId, {sourceId} )
  }

  getsize(): Vec2{
    return this.renderer.getSize(this.spiritId)
  }

  // showBorder(isShowBorder: boolean){
  //   if(this.isShowBorder === isShowBorder) return
  //   this.isShowBorder = isShowBorder
  //   if(isShowBorder){
  //     // this.renderer.craeteSpirit
  //   } else {

  //   }
  // }
  
  destory = () => {
    if(this.renderer) this.renderer.destroySpirit(this.spiritId)
    if(this.tansform) {
      this.tansform.off('positionChange', this.handlePositionChange)
      this.tansform.off('rotationChange', this.handleRotationChange)
      this.tansform.off('scaleChange', this.handleScaleChange)
    }
  }
}