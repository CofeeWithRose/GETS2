import { GE, createConfig, Transform, Render2DComp, Animation, AnimConfig, HitTest, HIT_TEST_GROUP, KeyBoard } from 'ge'
import { useEffect, useRef, useState } from 'react'

import { MoveController } from './componnet/MoveComp'
import { FuncComponent } from './componnet/FunComponent'
import stand1 from '../assets/player2/stand1.png'

import run1Url from '../assets/player2/run1.png'
import run2Url from '../assets/player2/run2.png'
import run3Url from '../assets/player2/run3.png'
import run4Url from '../assets/player2/run4.png'
import run5Url from '../assets/player2/run5.png'
import run6Url from '../assets/player2/run6.png'
import run7Url from '../assets/player2/run7.png'
import icon from '../assets/setting-press.png'

import { AutoMove } from './componnet/AutoMove'


export default {
    title: 'Run RENDER',
    component: Run,
}


function createPlayers(game: GE, ind: number){
        const player1 = game.craeteObj()
        
        player1.addComponent(
          Transform, 
          { x: 100+ 100 * ind, y: 100 }, 
          { x: 1, y: 1 },
          0 ,
        );

        const anims: AnimConfig = {
          'stand': { duration: 1, sourceList: [ {url: stand1} ] },
          'run': { duration: 0.8, sourceList: [
            {url: run1Url}, {url: run2Url},
            {url: run3Url}, {url: run4Url},
            {url: run5Url}, {url: run6Url},
            {url: run7Url}, 
          ]},
        }

        player1.addComponent(Render2DComp, stand1)
        // player1.addComponent(AutoMove, 320,720, 3)
        
        player1.addComponent(Animation, anims)
        player1.addComponent(FuncComponent, KeyBoard.a, KeyBoard.d, 200)
        // player1.addComponent(MoveController, KeyBoard.a, KeyBoard.d, 200)
        player1.addComponent(HitTest, {
          groupName: HIT_TEST_GROUP.A, 
          size: { x: 15, y: 10 }
        })
        game.stage.addChildren(player1)

        const player2 = game.craeteObj()
        game.stage.addChildren(player2)
        player2.addComponent(
          Transform, 
          { x: 200 + 100 * ind * 2, y: 100 }, 
          { x: 1, y: 1 }, 0,
        );
        player2.addComponent(Render2DComp, stand1)
        player2.addComponent(Animation, anims)
        player2.addComponent(FuncComponent, KeyBoard.LEFT, KeyBoard.RIGHT, 200)
        // player2.addComponent(MoveController, KeyBoard.LEFT, KeyBoard.RIGHT, 200)
        player2.addComponent(HitTest, {
          groupName: HIT_TEST_GROUP.B, 
          size: { x: 15, y: 10 }
        })
}


export function Run() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const gameRef = useRef<GE>(null)

    const [isrunning, setIsRunning] = useState(true)

    useEffect(() => {
        
        const canvas = canvasRef.current
        const game = gameRef.current = new GE(createConfig(canvas,[{ groupA: HIT_TEST_GROUP.A, groupB: HIT_TEST_GROUP.B }]))
        game.start()
        for (let index = 0; index < 100; index++) {
          createPlayers(game, index)
        }
        return () => game.destroy()
    }, [])

    let pauseOrStart = () => {
      if(gameRef.current.isRunning) {
        gameRef.current.pause()
        setIsRunning(false)
      } else {
        gameRef.current.start()
        setIsRunning(true)
      }
     
    }
    return <div>
        <canvas 
            style={{backgroundColor: 'gray'}}
            ref={canvasRef}
            width={1600}
            height={200}
        />
        <p>
          <button onClick={pauseOrStart} >{isrunning? 'pause': 'start'}</button>
        </p>
    </div>
}