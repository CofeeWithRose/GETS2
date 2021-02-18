import { Vec2 } from "../../components/Transform";
import { AbstractMnager } from "../../core/implement/AbstractManager";
import { GE } from "../../core/implement/GE";
import EventEmitor from "../../util/event/EventEmitor";
import MutiValueMap from "../../util/map/implement/MutiValueMap";
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

}  

export interface MoveInfo {
  
  position: Vec2

  /**
   * pixi/s
   */
  velocity: Vec2 

  /**
   * ms
   */
  time: number

}


export interface HitTestInfo {

  offset: Vec2

  position: Vec2

  rotation: number

  size: Vec2 
}

export interface ObjectHitTestInfo extends HitTestInfo{

  gameObjectId: number

}



interface ObjectMoveInfo extends MoveInfo {

  gameObjectId: number

}

interface HitResult {
  motionA: ObjectMoveInfo
  motionB: ObjectMoveInfo
}

export class HitTester extends AbstractMnager {

  #config: HitGroup[]

  #eventEniter = new EventEmitor()

  #hitInfoMap = new MutiValueMap<HIT_TEST_GROUP, ObjectHitTestInfo>()

  #hitResultMap = new Map<HIT_TEST_GROUP, HitResult[]>()
 
  constructor(game: GE, config: HitGroup[]){
    super(game, config)
    this.#config = config
  }

  addTestInfo( groupName: HIT_TEST_GROUP, gameObjectId: number, hitTestInfo: HitTestInfo){
    this.#hitInfoMap.add(groupName, { gameObjectId, ... hitTestInfo } )
  }

  updateTestInfo( groupName: HIT_TEST_GROUP, objectId: number, hitTestInfo: HitTestInfo){
    const array = this.#hitInfoMap.get(groupName)
    const index =  array.findIndex(({gameObjectId}) => gameObjectId == objectId )
    if(index > -1) array.set(index, { gameObjectId: objectId, ... hitTestInfo })
  }

  update = () => {
    this.#config.forEach( ({groupB, groupA}) => {
      const gA = this.#hitInfoMap.get(groupA).valus()
      const gB = this.#hitInfoMap.get(groupB).valus()
      if(gA && gB) this.chekHitTest(gA, gB)
    })
  }

  protected chekHitTest(groupA: ObjectHitTestInfo[], groupB: ObjectHitTestInfo[]): HitResult[]{

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
          console.log('hit...')
        } else {

        }

      })
    })

    return hitRest
  }

  protected isHit(
    lA: number, rA: number, tA: number, bA: number,
    lB: number, rB: number, tB: number, bB: number,
  ){
    const isXHit = (lA >= lB && lA <= rB)|| ( rA >= lB && rA <= rB )
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