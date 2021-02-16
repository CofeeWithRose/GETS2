import {AbstractMnager} from "../../../core/implement/AbstractManager";
import InputManagerInterface from "../interface/InputManagerInterface";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import { KeyBoard, InputType } from "../interface/data/enum";
import InputEvent from "../interface/data/InputEvent";
import { GE } from "../../../core/implement/GE";

export default class InputManager extends AbstractMnager implements InputManagerInterface {

    constructor(game: GE,config: AbstractManagerConfig){
        super(game, config);
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
    
    updated = () => {
        const downKeys = Object.keys(this.hasKeysDown);
        for(let i = 0; i< downKeys.length; i++){
            this.hasKeysDown[downKeys[i]] = false;
        }

        const upKeys = Object.keys(this.hasKeysUp);
        for(let i = 0; i< upKeys.length; i++){
            this.hasKeysUp[upKeys[i]] = false;
        }
    }

    keyDown(...keyBoard: KeyBoard[]): boolean {
        for(let i =0; i< keyBoard.length; i++ ){
          if(this.hasKeysDown[keyBoard[i]]) return true
        }
        return false;
    }

    keyUp(...keyBoard: KeyBoard[]): boolean{
      for(let i =0; i< keyBoard.length; i++ ){
        if(!this.hasKeysDown[keyBoard[i]]) return true
      }
      return false;
    }

    isKeyDown(...keyBoard: KeyBoard[]): boolean{

      for(let i =0; i< keyBoard.length; i++ ){
        if(this.isKeysDown[keyBoard[i]]) return true
      }
      return false;
    };

    isKeyUp(...keyBoard: KeyBoard[]): boolean{
      for(let i =0; i< keyBoard.length; i++ ){
        if(!this.isKeysDown[keyBoard[i]]) return true
      }
      return false;
    };

    onKeyDown(fun: Function, ...keyBoard: KeyBoard[]): void{
        fun();
    };

    onKeyUp( fun: Function, ...keyBoard: KeyBoard[]): void{
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