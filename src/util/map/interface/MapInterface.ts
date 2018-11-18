export default interface MapInterface< T, P> {
    
    get(key: T): P;

    set(key: T, value: P): void;

    remove(key: T):void;

    keys(): Array<T>;

    values(): Array<P>;
}