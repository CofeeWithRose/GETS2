import { ComponentInstance, FunComponent } from "../../../core/interface/AbstractComponentInterface";
import {AbstractComponent} from "../../../core/implement/AbstractComponent";
import { Renderer } from "../../../managers/Renderer/implement/Renderer";
import { Transform, Vec2 } from "../../Transform";

export interface Render2DCompInfer {

  setSourceId(sourceId: number): void

  getsize(): Vec2

}


export const Render2DComp: FunComponent<Render2DCompInfer> = function Render2DCompFun(ge, obj, sourceUrl: string) {

  
  let _sourceId: number

  let _renderer: Renderer

  let _spiritId: string

  let _tansform: ComponentInstance<typeof Transform>

  const _handlePositionChange = (x: number, y: number) => {
    _renderer.updatePosition(_spiritId, x,  y)
  
  }

  const _handleScaleChange = (scale: Vec2) => {
    _renderer.updateScale(_spiritId, scale)
  }

  const _handleRotationChange = (rotation: number) => {
    _renderer.updateRotation(_spiritId, rotation)
  }


  obj.regist('start', async () => {
    
    _tansform = obj.getComponent(Transform)

   

    _renderer = ge.getManager(Renderer)

    _sourceId = await _renderer.loadSource(sourceUrl)
    _spiritId =  _renderer.craeteSpirit(_sourceId, {
      position: _tansform.getPosition(),
      scale: _tansform.getScale(),
      rotation: _tansform.getRotation(),
    } )

    _tansform.on('positionChange', _handlePositionChange)

    _tansform.on('rotationChange', _handleRotationChange)

    _tansform.on('scaleChange', _handleScaleChange)
    
  })

  function setSourceId(sourceId: number){
    _renderer.updateSourceId(_spiritId, sourceId)
  }

  function getsize(): Vec2{
    return _renderer.getSize(_spiritId)
  }
  
  obj.regist('destory',  () => {
    if(_renderer) _renderer.destroySpirit(_spiritId)
    if(_tansform) {
      _tansform.off('positionChange', _handlePositionChange)
      _tansform.off('rotationChange', _handleRotationChange)
      _tansform.off('scaleChange', _handleScaleChange)
    }
  })

  return {
    getsize,
    setSourceId,
  }
}