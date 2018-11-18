
export default interface AbstractManagerConfig {


    subscribeEvent(eventName: string, fun: (...params: Array<any>) => void ): void;
}