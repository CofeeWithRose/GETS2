import GE from "./core/implement/GE";
import { ManagerNameSpaces, ComponentNameSpace } from "./util/enums/NameSpaces";
import GameObject from "./managers/gameobject/implement/data/GameObject";
import config from './configs';

GE.init(config);
// GE.getManager()
const gO = new GameObject();
gO.addComponent(ComponentNameSpace.POSITION_2D);
console.log(  gO.getComponent(ComponentNameSpace.POSITION_2D).ComponentNameSpace);
// GE.instanceComponentLoader(gO);