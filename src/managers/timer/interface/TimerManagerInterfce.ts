import {AbstractSystemInterface} from "../../../core/interface/AbstractManagerInterface";

export default interface TimerManagerInterfce extends AbstractSystemInterface {

    readonly DealTime:number;

    /**
     * 单位 s.
     */
    readonly StartFromNow :number;

    readonly FrameCount: number;

    init(): void;

    willUpdate(now?: number):void;
}