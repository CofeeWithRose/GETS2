import { GE, GameObject, config, Position2DComponent, Render2DComp, InitConfigInterface } from 'ge'
import React from 'react'

export default {
    title: 'Run RENDER',
    component: Run,
}


enum ComponentType {
    PositionComp,
    RendererComp,
}

const cfg: InitConfigInterface = {
    ...config,
}


const game = new GE()
game.init(cfg);

const obj1 = game.craeteObj()
obj1.addComponent(Position2DComponent);
obj1.addComponent(Render2DComp)


const obj1_1 = game.craeteObj()
obj1_1.addComponent(Position2DComponent);
obj1_1.addComponent(Render2DComp)
obj1.addChildren(obj1_1)

// obj1.destory()

game.start()



export function Run() {
    return <div>run</div>
}