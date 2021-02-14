// import GE from "./core/implement/GE";
// import { ManagerNameSpaces, ComponentNameSpace } from "./util/enums/NameSpaces";
// import GameObject from "./managers/gameobject/implement/data/GameObject";
// import config from './configs';

// GE.init(config);
// // GE.getManager()
// const obj = new GameObject();
// obj.addComponent(ComponentNameSpace.POSITION_2D);
// console.log( obj.getComponent(ComponentNameSpace.POSITION_2D).ComponentNameSpace);
// // GE.instanceComponentLoader(gO);

export { GE } from "./core/implement/GE";
export { ManagerNameSpaces, ComponentNameSpace } from "./util/enums/NameSpaces";
export {GameObject} from "./managers/gameobject/implement/data/GameObject";
export {config} from './configs';