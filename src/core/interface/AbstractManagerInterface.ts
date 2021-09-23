import AbstractGEObjectInterface from "./AbstractGEObjectInterface";
import { GEEvents } from "../../util/enums/GEEvent";
import { GE } from "../implement/GE";

export interface AbstractManagerInterface extends AbstractGEObjectInterface {
    

    addGEEvemtListener(ventName: GEEvents, fun : Function): void;

    init(time?: number): void

    willUpdate(time?: number): void

    update(time?: number): void

    updated(time?: number): void

    afterUpdated(): void

    destroy(): void
}

export interface AbstractManagerConstructor<P extends any[]> {
    new ( game: GE, ...params:P): AbstractManagerInterface
}