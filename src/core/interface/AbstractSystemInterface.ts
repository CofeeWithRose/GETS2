import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import { GEEvents } from "../../util/enums/GEEvent";
import { GE } from "../implement/GE";

export interface AbstractSystemInterface extends AbstractGEObjectInterface {
    
    addGEEvemtListener(ventName: GEEvents, fun : Function): void;

     start(): void

     update(): void

     afterUpdated(): void

     destroy(): void
}

export interface AbstractSystemConstructor<P extends any[]> {
    new ( world: GE, ...params:P): AbstractSystemInterface
}