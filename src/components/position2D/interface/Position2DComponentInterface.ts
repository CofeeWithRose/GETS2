import {AbstractComponentInterface} from "../../../core/interface/AbstractComponentInterface";

export default interface Position2DComponentInterface extends AbstractComponentInterface {

    X:number;

    Y: number;

    readonly OldX: number;

    readonly OldY: number;

    readonly Time: number;

    readonly OldTime: number;
}