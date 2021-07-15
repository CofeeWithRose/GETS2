import { ComponentInstance, FunComponent } from "src/core/interface/AbstractComponentInterface";
import { AbstractComponent } from "../../core/implement/AbstractComponent";
import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import GameObjectManager from "../../managers/gameobject/implement/GameObjectManager";
import { HitTester, HitTestInfo, MoveInfo } from "../../managers/HitTester";
import { HIT_TEST_GROUP } from "../../managers/HitTester/infer";
import EventEmitor from "../../util/event/EventEmitor";
import { Render2DComp } from "../render2D/implement/Render2DComp";
import { Transform, TransformEvent, TransformInfer, Vec2 } from "../Transform";

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


// export class HitTest extends AbstractComponent {

  // #hitTester: HitTester

  // #objManager :GameObjectManager


  // #transform: TransformInfer


  // #eventEmiter = EventEmitor()

  // #shapInfo: ShapInfo

  // protected lastPosition: Vec2

  // protected position: Vec2


  // init = (shapInfo: ShapInfo) => {
  //   this.#shapInfo = shapInfo
  // }

  // protected completeShapInfo(){
  //   const { offset, size } = this.#shapInfo
  //   if(!offset) this.#shapInfo.offset = { x: 0, y: 0 }
  //   if(!size) this.#shapInfo.size = this.GameObject.getComponent(Render2DComp)?.getsize()||{ x: 11, y: 11}
  // }

  // start = () => {

  //   this.completeShapInfo()
  //   this.#objManager = this.getManager(GameObjectManager)

  //   this.#hitTester = this.getManager(HitTester)
  //   this.#hitTester.on('hitBegin', this.GameObject.Id, this.#handleHitBegin )
  //   this.#hitTester.on('hitEnd', this.GameObject.Id, this.#handleHitEnd )
  //   this.#hitTester.on('hitting', this.GameObject.Id, this.#handleHitting )


  //   this.#transform = this.GameObject.getComponent(Transform)
  //   const position = this.#transform.getPosition()
  //   const scale = this.#transform.getScale()
  //   const rotation = this.#transform.getRotation()
  //   this.lastPosition = this.#transform.getPosition()
  //   this.position = this.lastPosition
  //   const info =  this.getHitTestInfo(position, rotation, scale )
  //   // this.#hitTester.addTestInfo(this.#shapInfo.groupName, this.GameObject.Id, info)
  //   // this.#transform.on('transformChange',this.#handleTransformChange )
  //   this.#transform.on('positionChange', this.#handlePositionChange)


  // }

  // destory = () => {
  //   this.#transform.off('transformChange', this.#handleTransformChange)

  //   this.#hitTester.off('hitBegin', this.GameObject.Id, this.#handleHitBegin )
  //   this.#hitTester.off('hitEnd', this.GameObject.Id, this.#handleHitEnd )
  //   this.#hitTester.off('hitting', this.GameObject.Id, this.#handleHitting )
  // }

  // #handlePositionChange: TransformEvent['positionChange'] = (x: number, y: number) => {
  //   this.lastPosition = this.position
  //   this.position = {x, y}
  // }

  // #handleTransformChange = (position: Vec2, rotation: number, scale: Vec2 ) => {
  //   const info =  this.getHitTestInfo(position, rotation, scale )
  //   this.#hitTester.updateTestInfo(this.#shapInfo.groupName, this.GameObject.Id, info)
  // }

  // protected getHitTestInfo(_: Vec2, rotation: number, scale: Vec2 ): HitTestInfo {
  //   const { size, offset } = this.#shapInfo
  //   const info: HitTestInfo =  {
  //     position: this.position,
  //     offset,
  //     rotation,
  //     deltaPosition: {
  //       x: this.position.x -  this.lastPosition.x, 
  //       y: this.position.y - this.lastPosition.y
  //     },
  //     size: {
  //       x: Math.abs(size.x * scale.x),
  //       y: Math.abs(size.y * scale.y)
  //     },
  //   }
  //   return info
  // }

  // #handleHitBegin = (gameObjectId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) => {
  //   const obj = this.#objManager.findGameObjectById(gameObjectId)
  //   this.emit('hitBegin', obj, otherMotion, selfMotion)
  // }

  // #handleHitEnd = (gameObjectId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) => {
  //   const obj = this.#objManager.findGameObjectById(gameObjectId)
  //   this.emit('hitEnd', obj, otherMotion, selfMotion)
  // }

  // #handleHitting = (gameObjectId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) => {
  //   const obj = this.#objManager.findGameObjectById(gameObjectId)
  //   this.emit('hitting', obj, otherMotion, selfMotion)
  // }


  // on<E extends keyof HitTestEvent>(eventName: E, cb: HitTestEvent[E]){
  //   this.#eventEmiter.addEventListener(eventName, cb)
  // }

  // off<E extends keyof HitTestEvent>(eventName: E, cb: HitTestEvent[E]){
  //   this.#eventEmiter.removeEventListener(eventName, cb)
  // }

  // protected emit<E extends keyof HitTestEvent>(eventName: E, ...params: Parameters<HitTestEvent[E]>){
  //   this.#eventEmiter.emit(eventName, ...params)
  // }

// }

// TODO  transform removed event. 
export const HitTest: FunComponent<any> = function HitHest(ge, obj, shapInfo: ShapInfo) {
  const _shapInfo = {...shapInfo}
  let _hitTester: HitTester

  let _objManager :GameObjectManager


  let _transform: TransformInfer


  const _eventEmiter = EventEmitor()


  let _lastPosition: Vec2

  // let _position: Vec2


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
    // _position = _lastPosition
    const info =  _getHitTestInfo(position, rotation, scale )
    // _hitTester.addTestInfo(_shapInfo.groupName, obj.id, info)
    _transform.on('transformChange',_handleTransformChange )
    // _transform.on('positionChange', _handlePositionChange)


  })

  obj.regist('destory', () => {
    _transform.off('transformChange', _handleTransformChange)

    _hitTester.off('hitBegin', obj.id, _handleHitBegin )
    _hitTester.off('hitEnd', obj.id, _handleHitEnd )
    _hitTester.off('hitting', obj.id, _handleHitting )
  })


  // const _handlePositionChange: TransformEvent['positionChange'] = (x: number, y: number) => {
  //   _lastPosition = _position
  //   _position = {x, y}
  // }

  const _handleTransformChange = (position: Vec2, rotation: number, scale: Vec2 ) => {
    const info =  _getHitTestInfo(position, rotation, scale )
    _hitTester.updateTestInfo(_shapInfo.groupName, obj.id, info)
  }

  function _getHitTestInfo(position: Vec2, rotation: number, scale: Vec2 ): HitTestInfo {
    const { size, offset } = _shapInfo
    const info: HitTestInfo =  {
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