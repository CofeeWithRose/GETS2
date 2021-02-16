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
const obj = game.craeteObj()
obj.addComponent(Position2DComponent);
obj.addComponent(Render2DComp)

game.start()

obj.destory()

export function Run() {
    return <div>run</div>
}