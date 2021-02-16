import {AbstractManagerInterface} from "../../../core/interface/AbstractManagerInterface";

export default interface TimerManagerInterfce extends AbstractManagerInterface {

    readonly DealTime:number;

    readonly StartFromNow :number;

    readonly FrameCount: number;

    init(): void;

    willUpdate():void;
}