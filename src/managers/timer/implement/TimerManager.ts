import {AbstractMnager} from "../../../core/implement/AbstractManager";
import TimerManagerInterfce from "../interface/TimerManagerInterfce";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import { Ranger, Scale } from "../../../util/decorators/Number";
import { GE } from "../../../core/implement/GE";

export default class TimerManager extends AbstractMnager implements TimerManagerInterfce {

    constructor(game: GE ,config: AbstractManagerConfig){
        super(game, config);
    }

    private nowFromStart = 0;

    get NowFromStart(){
        return this.nowFromStart;
    }

    //单位秒(s).
    private  dealTime = 0;
    //单位秒(s).
    private  startFromeNow = 0;

    private  startTime = 0;

    //时间的缩放 单位 ms=> s, ( 0 ~ 1 ) * 0.001;
    private sacle = 1;

    // private fpsDom: HTMLDivElement;

    private frameCount = 0;


    get FrameCount(){
        return this.frameCount;
    }

    get DealTime (){
        return this.dealTime
    };

    get StartFromNow (){
        return this.startFromeNow * 0.001;
    };

    get Scale(){
        return this.sacle;
    }

    @Ranger(0,1)
    set Scale(scale: number){
        this.sacle = scale;
    }

    public init(){
        this.startTime = Date.now();
    };
    

    public willUpdate(){
        this.frameCount ++;
        const newStartFromeNow = (Date.now() - this.startTime) * this.sacle;
        
        this.dealTime = (newStartFromeNow - this.startFromeNow);
        this.startFromeNow = newStartFromeNow;

    };
}