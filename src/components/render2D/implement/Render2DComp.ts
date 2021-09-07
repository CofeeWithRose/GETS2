import { FunComponent } from "../../../core/interface/AbstractComponentInterface";
import { Renderer } from "../../../managers/Renderer/implement/Renderer";
import { Transform,  TransformInfer, Vec2 } from "../../Transform";
import { Iimage } from "i-render";

export interface Render2DCompInfer {

  setSourceId(sourceId: number): void

  getsize(): Vec2

}


export const Render2DComp: FunComponent<Render2DCompInfer> = function Render2DCompFun(ge, obj, sourceUrl: string) {

  
  let _sourceId: number

  let _renderer: Renderer

  let _sprite: Iimage

  let _tansform: TransformInfer


  obj.regist('start', async () => {
    
    _tansform = obj.getComponent(Transform)
    const _position = _tansform.getPosition()
   
    const _scale = _tansform.getScale()

    _renderer = ge.getManager(Renderer)

    _sourceId = await _renderer.loadSource(sourceUrl)
    _sprite =  _renderer.craeteSpirit(_sourceId, {
      position: {x: _position.x, y: _position.y},
      scale: _tansform.getScale(),
      rotation: _tansform.getRotation(),
    } )

    obj.regist('update', function update() {
      if(_tansform.positionChanged)   _sprite.setPosition( _position.x,  _position.y)
      if(_tansform.rotationChanged) _sprite.setRotation(_tansform.rotation)
      if(_tansform.scaleChanged) _sprite.setScale(_scale.x, _scale.y)
    })
   
  })

  function setSourceId(sourceId: number){
    _sprite.setImgId(sourceId)
  }

  function getsize(): Vec2{
    return _sprite.size
  }
  
  obj.regist('destroy',  () => {
    _renderer.destroySpirit(_sprite)
  })

  return {
    getsize,
    setSourceId,
  }
}