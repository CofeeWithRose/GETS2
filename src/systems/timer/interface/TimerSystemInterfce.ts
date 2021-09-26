import {AbstractSystemInterface} from "../../../core/interface/AbstractSystemInterface";

export default interface TimerSystemInterfce extends AbstractSystemInterface {

    readonly DealTime:number;

    /**
     * 单位 s.
     */
    readonly StartFromNow :number;

    readonly FrameCount: number;

    init(): void;

    willUpdate(now?: number):void;
}