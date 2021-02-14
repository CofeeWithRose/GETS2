import React from 'react'
export default {
    title: 'Run RENDER',
    component: Run,
}

// import GE from "./core/implement/GE";
// import { ManagerNameSpaces, ComponentNameSpace } from "./util/enums/NameSpaces";
// import GameObject from "./managers/gameobject/implement/data/GameObject";
// import config from './configs';
import { GE, ManagerNameSpaces, ComponentNameSpace, GameObject, config } from 'ge'

GE.init(config);
const obj = new GameObject();
obj.addComponent(ComponentNameSpace.POSITION_2D);
console.log( obj.getComponent(ComponentNameSpace.POSITION_2D).ComponentNameSpace);

export function Run() {
    return <div>run</div>
}