import { GE, createConfig, Position2DComponent, Render2DComp, InitConfigInterface } from 'ge'
import { useEffect, useRef } from 'react'
import stand1 from '../assets/player2/stand1.png'
import { MoveController } from './componnet/MoveComp'

export default {
    title: 'Run RENDER',
    component: Run,
}





export function Run() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        
        const canvas = canvasRef.current
        const game = new GE(createConfig(canvas))
        game.start()

        const obj1 = game.craeteObj()
        obj1.addComponent(Position2DComponent, { x: 100, y: 100 });
        obj1.addComponent(Render2DComp, stand1)
        obj1.addComponent(MoveController)

        const obj1_1 = game.craeteObj()
        obj1_1.addComponent(Position2DComponent, { x: 250, y: 100 });
        obj1_1.addComponent(Render2DComp, stand1)
        obj1.addChildren(obj1_1)
        // obj1.removeChildren(obj1_1)
        // obj1.destory()

    }, [])
    return <div>
        <canvas 
            ref={canvasRef}
            width={800}
            height={600}
        />
    </div>
}