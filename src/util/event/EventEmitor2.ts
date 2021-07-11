import MutiValueMap from "../map/implement/MutiValueMap";

export default function EventEmitor() {

    const _listeners = new Map<string|number, Function[]>();

    const _afterEmit: {eventName: string|number, fun: Function}[] =[]

    let _isEmitting = false

    function addEventListener(eventName: string|number, fun: Function){
      let tasksList = _listeners.get(eventName)
      if(!tasksList) {
        tasksList = []
        _listeners.set( eventName, tasksList)
      }  
      tasksList.push(fun);
    }

    function removeEventListener(eventName: string|number, fun: Function){
      if(_isEmitting) {
        _afterEmit.push({eventName, fun})
      }else{
        const listeners = _listeners.get(eventName)
        if(listeners) {
          const ind = listeners.indexOf(fun)
          if (ind > -1) listeners.splice(ind, 1)
        }
        // _listeners.removeValue(eventName, fun);
      }
    }

    function emit(eventName: string|number, ...params:Array<any> ){
      _isEmitting = true
      const listeners = _listeners.get(eventName)||[];
      listeners.forEach(listener => {
        listener(...params)
      });
 
      if(_afterEmit.length) {
        _afterEmit.forEach( ({eventName, fun}) => removeEventListener(eventName, fun) )
        _afterEmit.slice(0)
      }

      _isEmitting = false

    }

    return {
      addEventListener,
      removeEventListener,
      emit
    }
}
