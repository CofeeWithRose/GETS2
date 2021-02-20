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
import { KeyBoard } from '../../managers/input/interface/data/enum'


export default {
    title: 'Run RENDER',
    component: Run,
}


function createPlayer(game: GE, count: number){
  const xNum = 5
  const x = count%xNum * 100 + 100
  const y = Math.ceil(count/xNum) * 170
  const player1 = game.craeteObj()
    player1.addComponent(
      Transform, 
      { x, y }, 
      { x: 1, y: 1 },
      0 ,
    );
    player1.addComponent(Render2DComp, stand1)
    const anims: AnimConfig = {
      'stand': { duration: 1, sourceList: [ {url: stand1} ] },
      'run': { duration: 1, sourceList: [
        {url: run1Url}, {url: run2Url},
        {url: run3Url}, {url: run4Url},
        {url: run5Url}, {url: run6Url},
        {url: run7Url}, 
      ]},
    }
    player1.addComponent(Animation, anims)
    player1.addComponent(MoveController, undefined, undefined, 200)
    player1.addComponent(HitTest, {groupName: HIT_TEST_GROUP.B})
}


export function Run() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        
        const canvas = canvasRef.current
        const game = new GE(createConfig(canvas,[{ groupA: HIT_TEST_GROUP.A, groupB: HIT_TEST_GROUP.A }]))
        game.start()

        // for(let i =0; i< 10; i++){
        //   createPlayer(game, i+1)
        // }

        const player1 = game.craeteObj()
        player1.addComponent(
          Transform, 
          { x: 100, y: 100 }, 
          { x: 1, y: 1 },
          0 ,
        );
        player1.addComponent(Render2DComp, stand1)
        const anims: AnimConfig = {
          'stand': { duration: 1, sourceList: [ {url: stand1} ] },
          'run': { duration: 0.2, sourceList: [
            {url: run1Url}, {url: run2Url},
            {url: run3Url}, {url: run4Url},
            {url: run5Url}, {url: run6Url},
            {url: run7Url}, 
          ]},
        }
        player1.addComponent(Animation, anims)
        player1.addComponent(MoveController, undefined, undefined, 200)
        player1.addComponent(HitTest, {
          groupName: HIT_TEST_GROUP.A, 
          size: { x: 4, y: 10 }
        })

        const player2 = game.craeteObj()
       
        player2.addComponent(
          Transform, 
          { x: 300, y: 100 }, 
          { x: 1, y: 1 }, 0,
        );
        player2.addComponent(Render2DComp, stand1)
        player2.addComponent(Animation, anims)
        player2.addComponent(MoveController, [KeyBoard.LEFT], [KeyBoard.RIGHT], 200)

        player2.addComponent(HitTest, {
          groupName: HIT_TEST_GROUP.A, 
          size: { x: 4, y: 10 }
        })
       

    }, [])
    return <div>
        <canvas 
            ref={canvasRef}
            width={800}
            height={600}
        />
    </div>
}