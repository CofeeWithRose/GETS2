import {AbstractComponent} from "../../../core/implement/AbstractComponent";
import {Position2DComponentInterface, PositionEvent, Vec2} from "../interface/Position2DComponentInterface";
import TimerManagerInterfce from "../../../managers/timer/interface/TimerManagerInterfce";
import TimerManager from "../../../managers/timer/implement/TimerManager";
import EventEmitor from "../../../util/event/EventEmitor";

export class Position2DComponent extends AbstractComponent implements Position2DComponentInterface {



    private value: Vec2 = { x: 0, y:0 }


    private oldValue: Vec2 = { x: 0, y: 0}

    private time = 0;

    private oldTime = 0;

    private timer: TimerManagerInterfce;

    private eventEnitor: EventEmitor = new EventEmitor()


    protected parentPosition: Position2DComponent

    awake(){
       this.timer = this.getManager( TimerManager );
    };

    reset(position?: Vec2){
      this.value = position
      this.oldValue = position
    }


    get Value(){
       return this.value
    };


    set Value( newValue: Vec2 ){

        this.oldValue = this.value 
        this.oldTime = this.time;
        this.value = newValue
        this.GameObject.Children.forEach( c => {
            const position = c.getComponent(Position2DComponent)
            if(position) position.Value = { 
                x: position.Value.x + this.value.x - this.oldValue.x,
                y: position.Value.y + this.value.y - this.oldValue.y,
            }
        })
        if(this.timer) this.time = this.timer.StartFromNow;

        const deltaValue = {
          x: this.value.x - this.oldValue.x, 
          y: this.value.y - this.oldValue.y,
       }

        this.eventEnitor.emit('positionChange', this.value, deltaValue )
    };

    get OldValue(){
        return this.oldValue
    }

    get Time() {
        return this.time;
    };

    get OldTime(){
        return this.oldTime;
    }


    on<E extends keyof PositionEvent>(eventName: E, cb: PositionEvent[E]): void {
        this.eventEnitor.addEventListener(eventName, cb)
    }

    off<E extends keyof PositionEvent>(eventName: E, cb: PositionEvent[E]): void {
        this.eventEnitor.removeEventListener(eventName, cb)
    }
};
