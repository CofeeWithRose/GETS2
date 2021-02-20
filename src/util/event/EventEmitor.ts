import MutiValueMap from "../map/implement/MutiValueMap";

export default class EventEmitor {

    private listeners = new  MutiValueMap<string|number, Function>();

    private afterEmit: {eventName: string|number, fun: Function}[] =[]

    private isEmitting = false

    addEventListener(eventName: string|number, fun: Function){
        this.listeners.add(eventName, fun);
    }

    removeEventListener(eventName: string|number, fun: Function){
      if(this.isEmitting) {
        this.afterEmit.push({eventName, fun})
      }else{
        this.listeners.removeValue(eventName, fun);
      }
    }

    emit(eventName: string|number, ...params:Array<any> ){
      this.isEmitting = true

      const listeners = this.listeners.get(eventName).valus();
      for(let i = 0; i< listeners.length; i++){
          try{
            listeners[i](...params);
          }catch (e){
              console.error(e);
          }
          
      }
      if(this.afterEmit.length) {
        this.afterEmit.forEach( ({eventName, fun}) => this.removeEventListener(eventName, fun) )
        this.afterEmit=[]
      }

      this.isEmitting = false

    }
}
