import ArraySet from "../../ArraySet";
import Map from './Map';

/**
 * 一对多的map，value 将自动去重.
 */
export default class MutiValueMap <K, V> {

    private map = new Map <K, ArraySet<V>>();

    add(key: K, value: V): void {
        const arraySet = this.get(key);
        arraySet.add(value);
    };

    get(key: K): ArraySet<V> {
        let resultArray = this.map.get(key);
        if(!resultArray){
            resultArray = new ArraySet<V>();
            this.map.set(key, resultArray);
        }
        return resultArray;
    };
    keys(){
        return this.map.keys();
    }
    values(): Array<V>{
        return this.map.values().reduce( (resulrtArray,itemArry) => {
          return resulrtArray.concat(itemArry.valus())
        }, []);
    }
    removeValues(key: K) {
        this.map.remove(key);
    };

    removeValue(key: K, value: V){
        const resultArray = this.map.get(key);
        if(resultArray){
            resultArray.remove(value);
        }
    };

}