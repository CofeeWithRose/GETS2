import AbstractMnager from "../../../core/implement/AbstractManager";
import InputManagerInterface from "../interface/InputManagerInterface";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import { KeyBoard, InputType } from "../interface/data/enum";
import InputEvent from "../interface/data/InputEvent";
import { ManagerNameSpaces } from "../../../util/enums/NameSpaces";

export default class InputManager extends AbstractMnager implements InputManagerInterface {

    constructor(config: AbstractManagerConfig){
        super(config);
        this.managerNameSpace = ManagerNameSpaces.InputManager;
        window.addEventListener('keydown', event => {
          this.handleKeyDown(<KeyBoard>event.key);
        });

        window.addEventListener('keyup', event => {
            this.handleKeyUp(<KeyBoard>event.key);
          
        });
    };

    protected isKeysDown: any = {};

    protected hasKeysDown: any = {};

    protected hasKeysUp: any = {};

    private handleKeyUp(key: KeyBoard){

        this.isKeysDown[key] = false;
        this.hasKeysDown[key] = false;
        this.hasKeysUp[key] = true;
        
    };

    private handleKeyDown(key: KeyBoard){
        
        this.isKeysDown[key] = true;
        this.hasKeysDown[key] = true;
        this.hasKeysUp[key] = false;
    };
    
    updated(){
        const downKeys = Object.keys(this.hasKeysDown);
        for(let i = 0; i< downKeys.length; i++){
            this.hasKeysDown[downKeys[i]] = false;
        }

        const upKeys = Object.keys(this.hasKeysUp);
        for(let i = 0; i< upKeys.length; i++){
            this.hasKeysUp[upKeys[i]] = false;
        }
    }

    keyDown(keyBoard: KeyBoard): boolean{
        return this.hasKeysDown[keyBoard];
    }

    keyUp(keyBoard: KeyBoard): boolean{
        return this.hasKeysUp[keyBoard];
    }

    isKeyDown(keyBoard: KeyBoard): boolean{
        return this.isKeysDown[keyBoard];
    };

    isKeyUp(keyBoard: KeyBoard): boolean{
        return !this.isKeysDown[keyBoard];
    };

    onKeyDown(keyBoard: KeyBoard, fun: Function): void{
        fun();
    };

    onKeyUp( keyBoard: KeyBoard, fun: Function): void{
        fun();
    };

    triggerInputEvent( inputType: InputType,inputEvent: InputEvent): void {
        
        if(inputType === InputType.keyUp){
            this.handleKeyUp(inputEvent.Key);
        }else if(inputType === InputType.KeyDown){
            this.handleKeyDown(inputEvent.Key);
        }
    };
}