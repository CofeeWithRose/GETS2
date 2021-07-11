import {AbstractManagerInterface} from "../../../core/interface/AbstractManagerInterface";
import { GameObject } from "../implement/data/GameObject";
import GameObjectInterface from "./data/GameObjectInterface";


export default interface GameObjectManagerInterface extends AbstractManagerInterface {

    findGameObjectById(gameObjectId: number): GameObject;
    
}