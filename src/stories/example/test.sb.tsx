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

const cfg: InitConfigInterface<ComponentType> = {
    ...config,
    componentInfoArray: [
        {
            componentNameSpace: ComponentType.PositionComp,
            componentClass: Position2DComponent
        },
        {
            componentNameSpace: ComponentType.RendererComp,
            componentClass: Render2DComp,
        }
    ]
}


const game = new GE<ComponentType>()
game.init(cfg);
const obj = game.craeteObj()
obj.addComponent(ComponentType.PositionComp);
obj.addComponent(ComponentType.RendererComp)

game.start()

obj.destory()

export function Run() {
    return <div>run</div>
}