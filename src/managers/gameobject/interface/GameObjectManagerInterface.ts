import {AbstractSystemInterface} from "../../../core/interface/AbstractManagerInterface";
import { GameObject } from "../implement/data/GameObject";
import GameObjectInterface from "./data/GameObjectInterface";


export default interface GameObjectManagerInterface extends AbstractSystemInterface {

    findGameObjectById(gameObjectId: number): GameObject;
    
}