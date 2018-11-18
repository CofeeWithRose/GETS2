import MutiValueMap from "../map/implement/MutiValueMap";

export default class EventEmitor {

    private listeners = new  MutiValueMap<string|number, Function>();

    addEventListener(eventName: string|number, fun: Function){
        this.listeners.add(eventName, fun);
    }

    removeEventListener(eventName: string|number, fun: Function){
        this.listeners.removeValue(eventName, fun);
    }

    emit(eventName: string|number, ...params:Array<any> ){
      const listeners = [ ...this.listeners.get(eventName).valus() ];
      for(let i = 0; i< listeners.length; i++){
          try{
            listeners[i](...params);
          }catch (e){
              console.error(e);
          }
          
      }
    }
}
