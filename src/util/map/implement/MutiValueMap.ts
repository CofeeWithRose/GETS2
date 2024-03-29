export interface MutiValueMapInfer <K, V> {

    add(key: K, value: V): void

    get(key: K): V[]

    keys(): K[]

    values(): V[]

    removeValues(key: K): void

    removeValue(key: K, value: V): void

}
/**
 * 一对多的map.
 */
export default function MutiValueMap <K, V> (): MutiValueMapInfer <K, V>{

    const _map = new Map <K, V[]>();

    function add(key: K, value: V): void {
        const arraySet = get(key);
        arraySet.push(value);
    };

    function get(key: K): V[] {
        let resultArray = _map.get(key);
        if(!resultArray){
            resultArray = [];
            _map.set(key, resultArray);
        }
        return resultArray;
    };
    function keys(){
        const keys: K[] = []
        _map.forEach( (_, key) => {
            keys.push(key)
        })
        return keys;
    }
    function values(): Array<V> {
        const res: V[] = []
        _map.forEach((itemArry) => {
            res.push(...itemArry)
        })
        return res
    }
    function removeValues(key: K) {
        _map.delete(key);
    };

    function removeValue(key: K, value: V){
        const resultArray = _map.get(key);
        if(resultArray){
            const ind = resultArray.indexOf(value)
            if(ind > -1) resultArray.splice(ind, 1)
        }
    };
    return {
        add, get, keys, values, 
        removeValues, removeValue
    }
}