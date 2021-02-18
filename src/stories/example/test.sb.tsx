import { GE, createConfig, Transform, Render2DComp, Animation, AnimConfig } from 'ge'
import { useEffect, useRef } from 'react'

import { MoveController } from './componnet/MoveComp'
import stand1 from '../assets/player2/stand1.png'

import run1Url from '../assets/player2/run1.png'
import run2Url from '../assets/player2/run2.png'
import run3Url from '../assets/player2/run3.png'
import run4Url from '../assets/player2/run4.png'
import run5Url from '../assets/player2/run5.png'
import run6Url from '../assets/player2/run6.png'
import run7Url from '../assets/player2/run7.png'
import { HitTest } from '../../components/HitTest'
import { HIT_TEST_GROUP } from '../../managers/HitTester/infer'


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
        obj1.addComponent(
          Transform, 
          { x: 300, y: 200 }, 
          { x: 1, y: 1 },
          0 ,
        );
        obj1.addComponent(Render2DComp, stand1)
        const anims: AnimConfig = {
          'stand': { duration: 1, sourceList: [ {url: stand1} ] },
          'run': { duration: 1, sourceList: [
            {url: run1Url}, {url: run2Url},
            {url: run3Url}, {url: run4Url},
            {url: run5Url}, {url: run6Url},
            {url: run7Url}, 
          ]},
        }
        obj1.addComponent(Animation, anims)
        obj1.addComponent(MoveController)
        obj1.addComponent(HitTest, {groupName: HIT_TEST_GROUP.A, size: { x: 10, y: 10 }})

        const obj1_1 = game.craeteObj()
        obj1_1.addComponent(
          Transform, 
          { x: 450, y: 200 }, 
        );
        obj1_1.addComponent(Render2DComp, stand1)
        // obj1.addChildren(obj1_1)
        obj1_1.addComponent(HitTest, {groupName: HIT_TEST_GROUP.B, size: { x: 10, y: 10 }})
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