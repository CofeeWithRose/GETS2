import MapInterface from "../interface/MapInterface";

/**
 * key的类型限制为number或string.
 */
export default class SimpleMap< K extends (number|string) , V> implements MapInterface<K, V> {

    map:any = {};

    set(key:K, value:V){
        this.map[key] = value;
    }
    get(key: K): V{
        return this.map[key];
    };
    remove(key: K){
        this.map[key] = null;
    };
    keys(){
        return <Array<K>>Object.keys(this.map);
    };

    values(){
        const keys = Object.keys(this.map);
        const valueAerray = new Array();
        for(let i = 0; i< keys.length; i++){
            valueAerray.push(this.map[keys[i]]);
        }
        return valueAerray;
    };
    
}