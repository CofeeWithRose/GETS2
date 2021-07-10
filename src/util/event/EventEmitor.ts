import MutiValueMap from "../map/implement/MutiValueMap";

export default function EventEmitor() {

    const _listeners = MutiValueMap<string|number, Function>();

    const _afterEmit: {eventName: string|number, fun: Function}[] =[]

    let _isEmitting = false

    function addEventListener(eventName: string|number, fun: Function){
        _listeners.add(eventName, fun);
    }

    function removeEventListener(eventName: string|number, fun: Function){
      if(_isEmitting) {
        _afterEmit.push({eventName, fun})
      }else{
        _listeners.removeValue(eventName, fun);
      }
    }

    function emit(eventName: string|number, ...params:Array<any> ){
      _isEmitting = true
      const listeners = _listeners.get(eventName);
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
