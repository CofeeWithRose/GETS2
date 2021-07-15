import { ComponentInstance, FunComponent } from "src/core/interface/AbstractComponentInterface";
import { AbstractComponent } from "../../core/implement/AbstractComponent";
import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import GameObjectManager from "../../managers/gameobject/implement/GameObjectManager";
import { HitTester, PhysicalInfo, MoveInfo } from "../../managers/HitTester";
import { HIT_TEST_GROUP } from "../../managers/HitTester/infer";
import EventEmitor from "../../util/event/EventEmitor";
import { Render2DComp } from "../render2D/implement/Render2DComp";
import { Transform, TransformInfer, Vec2 } from "../Transform";

export interface HitTestEvent {

  hitBegin: (otherGameObject: AbstractComponentLoader, otherMotion: MoveInfo, selfMotion: MoveInfo ) => void

  hitEnd: (otherGameObject: AbstractComponentLoader, otherMotion: MoveInfo, selfMotion: MoveInfo ) => void

  hitting: (otherGameObject: AbstractComponentLoader, otherMotion: MoveInfo, selfMotion: MoveInfo ) => void
}


export interface ShapInfo {
 
  size?: Vec2

  offset?: Vec2

  groupName: HIT_TEST_GROUP

}


// FIXME  transform removed event. 
export const HitTest: FunComponent = function HitHest(ge, obj, shapInfo: ShapInfo) {
  const _shapInfo = {...shapInfo}
  let _hitTester: HitTester

  let _objManager :GameObjectManager


  let _transform: TransformInfer


  const _eventEmiter = EventEmitor()


  let _lastPosition: Vec2

  function _completeShapInfo(){
    const { offset, size } = _shapInfo
    if(!offset) _shapInfo.offset = { x: 0, y: 0 }
    if(!size) _shapInfo.size = obj.getComponent(Render2DComp)?.getsize()||{ x: 11, y: 11}
  }

  obj.regist('start', () => {
    _completeShapInfo()
    _objManager = ge.getManager(GameObjectManager)
    _hitTester = ge.getManager(HitTester)
    _hitTester.on('hitBegin', obj.id, _handleHitBegin )
    _hitTester.on('hitEnd', obj.id, _handleHitEnd )
    _hitTester.on('hitting', obj.id, _handleHitting )


    _transform = obj.getComponent(Transform)
    const position = _transform.getPosition()
    const scale = _transform.getScale()
    const rotation = _transform.getRotation()
    _lastPosition = {..._transform.getPosition()}
    const info =  _getHitTestInfo(position, rotation, scale )

    const _handleTransformChange = (position: Vec2, rotation: number, scale: Vec2 ) => {
      const info =  _getHitTestInfo(position, rotation, scale )
      _hitTester.updateTestInfo(_shapInfo.groupName, obj.id, info)
    }

    obj.regist('update', () => {

    })

  })

  obj.regist('destory', () => {

    _hitTester.off('hitBegin', obj.id, _handleHitBegin )
    _hitTester.off('hitEnd', obj.id, _handleHitEnd )
    _hitTester.off('hitting', obj.id, _handleHitting )
  })




  function _getHitTestInfo(position: Vec2, rotation: number, scale: Vec2 ): PhysicalInfo {
    const { size, offset } = _shapInfo
    const info: PhysicalInfo =  {
      position: position,
      offset,
      rotation,
      deltaPosition: {
        x: position.x -  _lastPosition.x, 
        y: position.y - _lastPosition.y
      },
      size: {
        x: Math.abs(size.x * scale.x),
        y: Math.abs(size.y * scale.y)
      },
    }
    _lastPosition.x = position.x
    _lastPosition.y = position.y
     
    return info
  }

  const _handleHitBegin = (gameObjectId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) => {
    const obj = _objManager.findGameObjectById(gameObjectId)
    _emit('hitBegin', obj, otherMotion, selfMotion)
  }

  const _handleHitEnd = (gameObjectId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) => {
    const obj = _objManager.findGameObjectById(gameObjectId)
    _emit('hitEnd', obj, otherMotion, selfMotion)
  }

  const _handleHitting = (gameObjectId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) => {
    const obj = _objManager.findGameObjectById(gameObjectId)
    _emit('hitting', obj, otherMotion, selfMotion)
  }


  function on<E extends keyof HitTestEvent>(eventName: E, cb: HitTestEvent[E]){
    _eventEmiter.addEventListener(eventName, cb)
  }

  function off<E extends keyof HitTestEvent>(eventName: E, cb: HitTestEvent[E]){
    _eventEmiter.removeEventListener(eventName, cb)
  }

  function _emit<E extends keyof HitTestEvent>(eventName: E, ...params: Parameters<HitTestEvent[E]>){
    _eventEmiter.emit(eventName, ...params)
  }

  return {
    on, off
  }
}