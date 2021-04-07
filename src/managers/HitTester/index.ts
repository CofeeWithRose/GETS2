import { Vec2 } from "../../components/Transform";
import { AbstractMnager } from "../../core/implement/AbstractManager";
import { GE } from "../../core/implement/GE";
import EventEmitor from "../../util/event/EventEmitor";
import MutiValueMap from "../../util/map/implement/MutiValueMap";
import {TimerManager} from "../timer/implement/TimerManager";
import { HIT_TEST_GROUP } from "./infer";


/**
  * 
  *   c  b  a
  * a 1  1  1
  * b 1  1
  * c 1  
  * 
  */
export interface HitGroup{ 
  groupA: HIT_TEST_GROUP, 
  groupB: HIT_TEST_GROUP 
}


export interface HitTesterEvent {

  hitBegin: (otherObjId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) =>  void

  hitEnd: (otherObjId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) =>  void

  hitting: (otherObjId: number, otherMotion: MoveInfo, selfMotion: MoveInfo) =>  void

}  

export interface MoveInfo {
  
  position: Vec2


  /**
   * pixi/s
   */
  direction: Vec2 

  size: Vec2

  /**
   * ms
   */
  deltaTime: number

}


export interface HitTestInfo {

  offset: Vec2

  position: Vec2

  rotation: number

  deltaPosition: Vec2

  size: Vec2 
}

export interface ObjectHitTestInfo extends HitTestInfo{

  gameObjectId: number

}



interface ObjectMoveInfo extends MoveInfo {

  gameObjectId: number

}

export interface HitResult {
  motionA: ObjectMoveInfo
  motionB: ObjectMoveInfo
}

export class HitTester extends AbstractMnager {

  #config: HitGroup[]

  #eventEniter = new EventEmitor()

  #hitInfoMap = new MutiValueMap<HIT_TEST_GROUP, ObjectHitTestInfo>()

  #hitRecord = new Map<string, HitResult>()

  #timer: TimerManager  
 
  constructor(game: GE, config: HitGroup[]){
    super(game, config)
    this.#config = config
  }

  init = () => {
    this.#timer = this.getManager(TimerManager)
  }
  

  addTestInfo( groupName: HIT_TEST_GROUP, gameObjectId: number, hitTestInfo: HitTestInfo){
    this.#hitInfoMap.add(groupName, { gameObjectId, ... hitTestInfo } )
  }

  updateTestInfo( groupName: HIT_TEST_GROUP, objectId: number, hitTestInfo: HitTestInfo){
    const array = this.#hitInfoMap.get(groupName)
    const index =  array.findIndex(({gameObjectId}) => gameObjectId == objectId )
    if(index > -1) array.set(index, { gameObjectId: objectId, ... hitTestInfo })
  }

  afterUpdated = () => {
    this.#config.forEach( ({groupB, groupA}) => {
      const gA = this.#hitInfoMap.get(groupA).valus()
      const gB = this.#hitInfoMap.get(groupB).valus()
      if(gA && gB) this.chekHitTest( this.#timer.DealTime ,gA, gB)
    })
  }

  protected chekHitTest(deltaTime: number, groupA: ObjectHitTestInfo[], groupB: ObjectHitTestInfo[]): HitResult[]{

    const hitRest: HitResult[] = []

    groupA.forEach( infoA => {

      groupB.forEach( infoB => {
        if(infoA.gameObjectId === infoB.gameObjectId) return
        const { position: posA, offset: offA, size: sA } = infoA
        const pA = {
          x: posA.x + offA.x,
          y: posA.y + offA.y,
        }
        const halfSizeAX = sA.x * 0.5
        const halfSizeAY = sA.y * 0.5
        const leftA = pA.x - halfSizeAX
        const rightA = pA.x + halfSizeAX
        const topA = pA.y - halfSizeAY
        const bottomA = pA.y + halfSizeAY
        
        const { position: posB, offset: offB, size: sB } = infoB
        const halfSizeBX = sB.x * 0.5
        const halfSizeBY = sB.y * 0.5
        const pB = {
          x: posB.x + offB.x,
          y: posB.y + offB.y,
        }
        const leftB = pB.x - halfSizeBX
        const rightB = pB.x + halfSizeBX
        const topB = pB.y - halfSizeBY
        const bottomB = pB.y + halfSizeBY

        if(this.isHit(
          leftA, rightA, topA, bottomA,
          leftB, rightB, topB, bottomB,
        )){
          
          const motionA: ObjectMoveInfo = {
              gameObjectId: infoA.gameObjectId,
              position: infoA.position,
              direction: infoA.deltaPosition,
              size: infoA.size,
              deltaTime,
          }
          const motionB: ObjectMoveInfo = {
            gameObjectId: infoB.gameObjectId,
            position: infoB.position,
            direction: infoB.deltaPosition,
            size: infoB.size,
            deltaTime,
          }
          const result: HitResult = {
            motionA, motionB
          }
          const key1 = `${infoA.gameObjectId}_${infoB.gameObjectId}`
          const key2 = `${infoB.gameObjectId}_${infoA.gameObjectId}`
          
          if(!this.#hitRecord.get(key1)){
            this.emit('hitBegin', motionA.gameObjectId, motionB.gameObjectId, motionB, motionA)
            this.emit('hitBegin', motionB.gameObjectId, motionA.gameObjectId, motionA, motionB)
          }
          this.emit('hitting', motionA.gameObjectId, motionB.gameObjectId, motionB, motionA)
           this.emit('hitting', motionB.gameObjectId, motionA.gameObjectId, motionA, motionB)
         
          this.#hitRecord.set(key1, result)
          this.#hitRecord.set(key2, result)

        } else {
          const key1 = `${infoA.gameObjectId}_${infoB.gameObjectId}`
          const key2 = `${infoB.gameObjectId}_${infoA.gameObjectId}`
          const result = this.#hitRecord.get(key1)
          if(result){
            const { motionB, motionA } = result
            this.emit('hitEnd', motionA.gameObjectId, motionB.gameObjectId, motionB, motionA)
            this.emit('hitEnd', motionB.gameObjectId, motionA.gameObjectId, motionA, motionB)
            this.#hitRecord.delete(key1)
            this.#hitRecord.delete(key2)
          }
        }

      })
    })

    return hitRest
  }

  protected isHit(
    lA: number, rA: number, tA: number, bA: number,
    lB: number, rB: number, tB: number, bB: number,
  ){
    const isXHit = (lA >= lB && lA <= rB) || (rA >= lB && rA <= rB)
    const isYHIt = (tA >= tB && tA <= bB) || (bA >= tB && bA <= bB)
    return isXHit && isYHIt
  }

  on<E extends keyof HitTesterEvent>(eventName: E, objId: number, cb: HitTesterEvent[E]){
    this.#eventEniter.addEventListener(`${eventName}_${objId}`, cb)
  }

  off<E extends keyof HitTesterEvent>(eventName: E,objId: number, cb: HitTesterEvent[E]){
    this.#eventEniter.removeEventListener(`${eventName}_${objId}`, cb)
  }

  protected emit<E extends keyof HitTesterEvent>(eventName: E, objId: number, ...params: Parameters<HitTesterEvent[E]>){
    this.#eventEniter.emit(`${eventName}_${objId}`, ...params)
  }


}