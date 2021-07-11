import { 
    AbstractComponentLoaderInterface, GE, KeyBoard, InputManager,
    Animation,  TimerManager, HitTest, Transform
} from 'ge'

export  function FuncComponent( 
    ge: GE,
    obj: AbstractComponentLoaderInterface,  
    left: KeyBoard=KeyBoard.a,
    right: KeyBoard=KeyBoard.d, 
    speed = 150 
) {

    // const component = {}
    const v = {x: 0, y: 0}

    obj.regist('start', () => {
        const input = ge.getManager(InputManager)
        const transform = obj.getComponent(Transform)
        const anim = obj.getComponent(Animation)
        const timer = ge.getManager(TimerManager)
        // const hitTest = obj.getComponent(HitTest)
        // hitTest && hitTest.on('hitting', handleHitting)
        const position = transform.getPosition()

        
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
              Math.floor(position.x + v.x * 0.01), 
              Math.floor(position.y + v.y * 0.01),
            )
        })
    })
    return {}
}