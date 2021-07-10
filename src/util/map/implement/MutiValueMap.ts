/**
 * 一对多的map，value 将自动去重.
 */
export default function MutiValueMap <K, V> (){

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
        return _map.keys();
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