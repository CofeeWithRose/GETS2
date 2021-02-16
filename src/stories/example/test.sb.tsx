import { GE, GameObject, createConfig, Position2DComponent, Render2DComp, InitConfigInterface } from 'ge'
import React, { useEffect, useRef } from 'react'

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
        obj1.addComponent(Position2DComponent);
        obj1.addComponent(Render2DComp)


        const obj1_1 = game.craeteObj()
        obj1_1.addComponent(Position2DComponent);
        obj1_1.addComponent(Render2DComp)
        obj1.addChildren(obj1_1)



        obj1.destory()

    }, [])
    return <div>
        <canvas 
            ref={canvasRef}
        />
    </div>
}