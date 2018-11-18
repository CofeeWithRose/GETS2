import MapInterface from "../interface/MapInterface";

export default class Map<T, P> implements MapInterface<T,P>{

    private keyArray = new Array<T>();
    private valueArry = new Array<P>();

    constructor(key?: T, value?: P){
        if(key){
            this.set(key,value);
        }
    }

    public get(key: T): P {
        const keyIndex =  this.keyArray.indexOf(key);
        return this.valueArry[keyIndex];
    }

    public set(key: T, value: P): void {
        const keyIndex =  this.keyArray.indexOf(key);
        if(keyIndex > -1){
            this.valueArry[keyIndex] = value;
        }else{
            this.keyArray.push(key);
            this.valueArry.push(value);
        }
       
    }

    public remove(key: T): Boolean {
        const keyIndex =  this.keyArray.indexOf(key);
        this.keyArray.splice(keyIndex, 1);
        this.valueArry.splice(keyIndex, 1)
        return false
    }

    public keys(): Array<T>{
        return [...this.keyArray];
    }

    public values(): Array<P>{
        return [...this.valueArry];
    }
}