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


export interface PhysicalInfo {

  offset: Vec2

  position: Vec2

  rotation: number

  deltaPosition: Vec2

  size: Vec2 
}

export interface ObjectPhysicalInfo extends PhysicalInfo{

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

  #eventEniter = EventEmitor()

  #hitInfoMap = MutiValueMap<HIT_TEST_GROUP, ObjectPhysicalInfo>()

  #hitRecord = new Map<string, HitResult>()

  #timer: TimerManager  
 
  constructor(game: GE, config: HitGroup[]){
    super(game, config)
    this.#config = config
  }

  init = () => {
    this.#timer = this.getManager(TimerManager)
  }
  

  addTestInfo( groupName: HIT_TEST_GROUP, gameObjectId: number, hitTestInfo: PhysicalInfo){
    this.#hitInfoMap.add(groupName, { gameObjectId, ... hitTestInfo } )
  }

  updateTestInfo( groupName: HIT_TEST_GROUP, objectId: number, hitTestInfo: PhysicalInfo){
    const array = this.#hitInfoMap.get(groupName)
    const index =  array.findIndex(({gameObjectId}) => gameObjectId == objectId )
    if(index > -1) array[index] = { gameObjectId: objectId, ... hitTestInfo }
  }

  afterUpdated = () => {
    this.#config.forEach( ({groupB, groupA}) => {
      const gA = this.#hitInfoMap.get(groupA)
      const gB = this.#hitInfoMap.get(groupB)
      if(gA && gB) this.chekHitTest( this.#timer.DealTime ,gA, gB)
    })
  }

  protected chekHitTest(deltaTime: number, groupA: ObjectPhysicalInfo[], groupB: ObjectPhysicalInfo[]): HitResult[]{

    const hitRest: HitResult[] = []

    groupA.forEach( infoA => {

      groupB.forEach( infoB => {
        if(infoA.gameObjectId === infoB.gameObjectId) return
        const { position: posA, offset: offA, size: sA } = infoA
        const pA = {
          x: posA.x + offA.x,
          y: posA.y + offA.y,
        }
        const leftA = pA.x
        const rightA = pA.x + sA.x
        const topA = pA.y
        const bottomA = pA.y + sA.y
        
        const { position: posB, offset: offB, size: sB } = infoB
        const pB = {
          x: posB.x + offB.x,
          y: posB.y + offB.y,
        }
        const leftB = pB.x
        const rightB = pB.x + sB.x
        const topB = pB.y
        const bottomB = pB.y + sB.y

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
    const isXNotHit = lB > rA || lA > rB
    const isYNotHIt = bA < tB || bB < tA
    return !(isXNotHit || isYNotHIt)
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