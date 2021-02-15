import { GE, GameObject, config, Position2DComponent, Render2DComp } from 'ge'
import React from 'react'

export default {
    title: 'Run RENDER',
    component: Run,
}


GE.init(config);
const obj = new GameObject();
obj.addComponent(Position2DComponent);
obj.addComponent(Render2DComp, 1)

GE.start()

obj.destory()

export function Run() {
    return <div>run</div>
}