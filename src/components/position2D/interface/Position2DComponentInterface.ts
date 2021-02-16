import {AbstractComponentInterface} from "../../../core/interface/AbstractComponentInterface";

export interface PositionEvent {
    positionChange: (newValue: Vec2, deltaValue: Vec2) => void
}

export interface Vec2 {
    readonly x: number
    readonly y: number
}

export interface Position2DComponentInterface extends AbstractComponentInterface {


    Value: Vec2

    readonly  OldValue: Vec2

    readonly Time: number;

    readonly OldTime: number;

    on<E extends keyof PositionEvent>(eventName: E, cb: PositionEvent[E]): void

    off<E extends keyof PositionEvent>(eventName: E, cb: PositionEvent[E]): void


}