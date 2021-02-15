import AbstractMnager from "../../../core/implement/AbstractManager";
import TimerManagerInterfce from "../interface/TimerManagerInterfce";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import { ManagerNameSpaces } from "../../../util/enums/NameSpaces";
import { Ranger, Scale } from "../../../util/decorators/Number";
import { GE } from "../../../core/implement/GE";

export default class TimerManager<ComponentType> extends AbstractMnager<ComponentType> implements TimerManagerInterfce {

    constructor(game: GE<ComponentType> ,config: AbstractManagerConfig){
        super(game, config);
        this.managerNameSpace = ManagerNameSpaces.TimerManager;
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
    private sacle = 1 * 0.001;

    private fpsDom: HTMLDivElement;

    private frameCount = 0;

    private lastFpsFromNOw = 0;

    //刷新fps时间间隔
    private fpsFrequence = 2;

    get FrameCount(){
        return this.frameCount;
    }

    get DealTime (){
        return this.dealTime
    };

    get StartFromNow (){
        return this.startFromeNow;
    };

    get Scale(){
        return this.sacle * 1000;
    }

    @Ranger(0,1)
    @Scale(0.001)
    set Scale(scale: number){
        this.sacle = scale;
    }

    public init(){
        this.startTime = Date.now();

        this.fpsDom = <HTMLDivElement>document.createElement('dv');
        this.fpsDom.style.width = '100 px';
        this.fpsDom.style.height = '20 px';
        this.fpsDom.style.position = 'fixed';
        this.fpsDom.style.top = '0';
        this.fpsDom.style.right = '0';
        this.fpsDom.style.color = 'white'; 
        document.body.appendChild(this.fpsDom);
    };
    

    public willUpdate(){
        this.frameCount ++;
        const newStartFromeNow = (Date.now() - this.startTime) * this.sacle;
        
        this.dealTime = (newStartFromeNow - this.startFromeNow);
        this.startFromeNow = newStartFromeNow;

        if( this.startFromeNow - this.lastFpsFromNOw > this.fpsFrequence){
            this.fpsDom.innerHTML = `FPS： ${ (1/this.dealTime).toFixed(2) }`;
            this.lastFpsFromNOw = this.startFromeNow;
        }
        
    };
}