import AbstractManagerInterface from "../../../core/interface/AbstractManagerInterface";

export default interface TimerManagerInterfce extends AbstractManagerInterface {

    NowFromStart: number;

    DealTime: number;

    FrameCount: number;
}