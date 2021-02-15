import AbstractComponent from "../../../core/implement/AbstractComponent";
import Position2DComponentInterface from "../interface/Position2DComponentInterface";
import TimerManagerInterfce from "../../../managers/timer/interface/TimerManagerInterfce";
import { ManagerNameSpaces } from "../../../util/enums/NameSpaces";

export class Position2DComponent extends AbstractComponent implements Position2DComponentInterface {

    constructor(){
        super();
    }

    private x = 0;

    private y = 0;

    private oldX = 0;

    private oldY =0;

    private time = 0;

    private oldTime = 0;

    private timer: TimerManagerInterfce;

    awake(){
        this.timer = <TimerManagerInterfce>this.getManager( ManagerNameSpaces.TimerManager );
    };

    get X(){
        return this.x;
    };

    set X( x: number ){
        
        this.oldX = this.x;
        this.oldTime = this.time;

        this.time = this.timer.StartFromNow;
        this.x = x;
    };

    get Y(){
        return this.y;
    };

    set Y( y:number ){
        
        this.oldY = this.y;
        this.oldTime = this.time;

        this.time = this.timer.StartFromNow;
        this.y = y;

    };

    get Time() {
        return this.time;
    };

    get OldTime(){
        return this.oldTime;
    }

    get OldX(){
        return this.oldX;
    }

    get OldY(){
        return this.oldY;
    }
};
