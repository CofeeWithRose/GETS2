import AbstractManagerInterface from "../../core/interface/AbstractManagerInterface";
import GameObjectInterface from "./GameObjectInterface";


export default interface GameObjectManagerInterface extends AbstractManagerInterface {

    findGameObjectById(gameObjectId: number): GameObjectInterface;
    
}