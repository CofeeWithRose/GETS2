import { 
  AbstractComponentLoader, GE, KeyBoard, InputManager,
    Animation,  TimerManager, HitTest, Transform, Entity, MoveInfo
} from 'ge'
export interface MoveProps {
  left: KeyBoard,
  right: KeyBoard,
  speed: number
}
export  function FuncComponent( 
    ge: GE,
    obj: AbstractComponentLoader,  
   {
    left=KeyBoard.a,
    right=KeyBoard.d, 
    speed = 150 
   }
) {

    // const component = {}
    const v = {x: 0, y: 0}

    obj.regist('start', () => {
        const input = ge.getManager(InputManager)
        const transform = obj.getComponent(Transform)
        const anim = obj.getComponent(Animation)
        const timer = ge.getManager(TimerManager)
  
        const position = transform.getPosition()

        const hitTest = obj.getComponent(HitTest)

        let hitInfo: {self: MoveInfo, other: MoveInfo}
        const handleHitting = (other: Entity, otherM: MoveInfo, selfM: MoveInfo) => {
          hitInfo = {
            self: selfM,
            other: otherM,
          }
        }

        hitTest.on('hitting', handleHitting)
        
        
        obj.regist('update', () => {
            const deltaTime = timer.DealTime
    
            if(input.isKeyDown(left)){
               v.x = -speed,
              transform.setScale({ x: 1, y: 1 })
              anim.play('run')
              
            } else if( input.isKeyDown(right)) {
              v.x = speed
              transform.setScale({ x: -1, y: 1})
              anim.play('run')
            } else {
              v.x = 0;
              v.y = 0
              anim.play('stand')
            }
            transform.setPosition(
              position.x + (v.x * deltaTime), 
              position.y + (v.y * deltaTime),
            )
            // console.log('v.x * deltaTime', v.x * deltaTime);
            

            // if(hitInfo){
            //   const {direction: otherDirection, deltaTime, position: otherPosition, size: otherSize } = hitInfo.other
            //   const { direction, position, size } = hitInfo.self
            //   const directionX = ((position.x - direction.x) - (otherPosition.x - otherDirection.x) ) > 0? -1: 1
            //   const dist = (otherSize.x + size.x) * 0.5 + Math.abs(directionX) * ((timer.DealTime/(deltaTime||1))||1)
            //   transform.setPosition(
            //     otherPosition.x - directionX * dist,
            //     position.y,
            //   )
            //   hitInfo = null
            // }else{
            //   transform.setPosition(
            //     Math.floor(position.x + v.x * 0.01), 
            //     Math.floor(position.y + v.y * 0.01),
            //   )
            // }
        })
    })
    return {}
}