import { FunComponent } from "src/core/interface/AbstractComponentInterface";
import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import GameObjectManager from "../../managers/gameobject/implement/GameObjectManager";
import { HitTester, PhysicalInfo, MoveInfo } from "../../managers/HitTester";
import { HIT_TEST_GROUP } from "../../managers/HitTester/infer";
import EventEmitor from "../../util/event/EventEmitor";
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

export interface HitTestInfer {
  size: Vec2
  offset: Vec2
  on: <E extends keyof HitTestEvent>(name: E, listener: HitTestEvent[E]) => void
  off: <E extends keyof HitTestEvent>(name: E, listener: HitTestEvent[E]) => void
}


export const HitTest: FunComponent<HitTestInfer, ShapInfo> = function HitHest(ge, obj, {groupName, offset, size}) {
  // const _shapInfo = {...shapInfo}
  offset = offset?? {x: 0, y: 0}
  size = size?? { x: 10, y:10 }
  let _hitTester: HitTester

  let _objManager :GameObjectManager


  let _transform: TransformInfer


  const _eventEmiter = EventEmitor()


  let _lastPosition: Vec2

  obj.regist('start', () => {
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
    _hitTester.addTestInfo(groupName, obj.id, info)
    const _handleTransformChange = (position: Vec2, rotation: number, scale: Vec2 ) => {
      // const info =  _getHitTestInfo(position, rotation, scale )
      // _hitTester.updateTestInfo(groupName, obj.id, info)
      info.rotation = rotation
      info.deltaPosition.x = position.x -  _lastPosition.x
      info.deltaPosition.y = position.y - _lastPosition.y,
      info.size.x = Math.abs(size.x * scale.x)
      info.size.y = Math.abs(size.y * scale.y)
      // deltaPosition: {
      //   x: position.x -  _lastPosition.x, 
      //   y: position.y - _lastPosition.y
      // },
      // size: {
      //   x: Math.abs(size.x * scale.x),
      //   y: Math.abs(size.y * scale.y)
      // },

      
    }

    obj.regist('update', () => {
      _handleTransformChange(position, rotation, scale)
    })

  })

  obj.regist('destory', () => {

    _hitTester.off('hitBegin', obj.id, _handleHitBegin )
    _hitTester.off('hitEnd', obj.id, _handleHitEnd )
    _hitTester.off('hitting', obj.id, _handleHitting )
  })




  function _getHitTestInfo(position: Vec2, rotation: number, scale: Vec2 ): PhysicalInfo {
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
    on, off, size, offset
  }
}