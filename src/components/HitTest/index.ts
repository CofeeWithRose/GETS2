import { AbstractComponent } from "../../core/implement/AbstractComponent";
import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import GameObjectManager from "../../managers/gameobject/implement/GameObjectManager";
import { HitTester, HitTestInfo, MoveInfo } from "../../managers/HitTester";
import { HIT_TEST_GROUP } from "../../managers/HitTester/infer";
import EventEmitor from "../../util/event/EventEmitor";
import { Transform, Vec2 } from "../Transform";

export interface HitTestEvent {

  hitBegin: (otherGameObject: AbstractComponentLoader, otherMotion: MoveInfo, selfMotion: MoveInfo ) => void

  hitEnd: (otherGameObject: AbstractComponentLoader, otherMotion: MoveInfo, selfMotion: MoveInfo ) => void

}


export interface ShapInfo {
 
  size: Vec2

  offset?: Vec2

  groupName: HIT_TEST_GROUP

}


export class HitTest extends AbstractComponent {

  #hitTester: HitTester

  #objManager :GameObjectManager


  #transform: Transform


  #eventEmiter = new EventEmitor()

  #shapInfo: ShapInfo


  init = (shapInfo: ShapInfo) => {
    this.#shapInfo = shapInfo
  }

  protected completeShapInfo(){
    const { offset } = this.#shapInfo
    if(!offset) this.#shapInfo.offset = { x: 0, y: 0 }
  }

  start = () => {

    this.completeShapInfo()
    this.#objManager = this.getManager(GameObjectManager)

    this.#hitTester = this.getManager(HitTester)
    this.#hitTester.on('hitBegin', this.GameObject.Id, this.#handleHitBegin )
    this.#hitTester.on('hitEnd', this.GameObject.Id, this.#handleHitEnd )


    this.#transform = this.GameObject.getComponent(Transform)
    const position = this.#transform.getPosition()
    const scale = this.#transform.getScale()
    const rotation = this.#transform.getRotation()
    const info =  this.getHitTestInfo(position, rotation, scale )
    this.#hitTester.addTestInfo(this.#shapInfo.groupName, this.GameObject.Id, info)
    this.#transform.on('transformChange',this.#handleTransformChange )


  }

  destory = () => {
    this.#transform.off('transformChange', this.#handleTransformChange)

    this.#hitTester.off('hitBegin', this.GameObject.Id, this.#handleHitBegin )
    this.#hitTester.off('hitEnd', this.GameObject.Id, this.#handleHitEnd )
  }

  #handleTransformChange = (position: Vec2, rotation: number, scale: Vec2 ) => {
    const info =  this.getHitTestInfo(position, rotation, scale )
    this.#hitTester.updateTestInfo(this.#shapInfo.groupName, this.GameObject.Id, info)
  }

  protected getHitTestInfo(position: Vec2, rotation: number, scale: Vec2 ): HitTestInfo {
    const { size, offset } = this.#shapInfo
    return {
      position,
      offset,
      rotation,
      size: {
        x: size.x * scale.x,
        y: size.y * scale.y
      },
    }
  }

  #handleHitBegin = (gameObjectId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) => {
    const obj = this.#objManager.findGameObjectById(gameObjectId)
    this.emit('hitBegin', obj, otherMotion, selfMotion)
  }

  #handleHitEnd = (gameObjectId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) => {
    const obj = this.#objManager.findGameObjectById(gameObjectId)
    this.emit('hitEnd', obj, otherMotion, selfMotion)
  }


  on<E extends keyof HitTestEvent>(eventName: E, cb: HitTestEvent[E]){
    this.#eventEmiter.addEventListener(eventName, cb)
  }

  off<E extends keyof HitTestEvent>(eventName: E, cb: HitTestEvent[E]){
    this.#eventEmiter.removeEventListener(eventName, cb)
  }

  protected emit<E extends keyof HitTestEvent>(eventName: E, ...params: Parameters<HitTestEvent[E]>){
    this.#eventEmiter.emit(eventName, ...params)
  }

}