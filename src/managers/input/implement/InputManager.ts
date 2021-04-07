import {AbstractMnager} from "../../../core/implement/AbstractManager";
import InputManagerInterface from "../interface/InputManagerInterface";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import { KeyBoard, InputType } from "../interface/data/enum";
import InputEvent from "../interface/data/InputEvent";
import { GE } from "../../../core/implement/GE";

export class InputManager extends AbstractMnager implements InputManagerInterface {

    constructor(game: GE,config: AbstractManagerConfig){
        super(game, config);
        window.addEventListener('keydown', event => {
          this.handleKeyDown(<KeyBoard>event.key);
        });

        window.addEventListener('keyup', event => {
            this.handleKeyUp(<KeyBoard>event.key);
          
        });
    };

    protected isKeysDownMap: any = {};

    protected hasKeysDown: any = {};

    protected hasKeysUp: any = {};

    private handleKeyUp(key: KeyBoard){

        this.isKeysDownMap[key] = false;
        this.hasKeysDown[key] = false;
        this.hasKeysUp[key] = true;
        
    };

    private handleKeyDown(key: KeyBoard){
        
        this.isKeysDownMap[key] = true;
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

    /**
     * 任意一个 keyBoard up 返回 true.
     * 每个 keyBoard 一次 up 只触发一次true.
     * @param keyBoard 
     * @returns 
     */
    keyUp(...keyBoard: KeyBoard[]): boolean{
      for(let i =0; i< keyBoard.length; i++ ){
        if(this.hasKeysUp[keyBoard[i]]) return true
      }
      return false;
    }

    /**
     * 所有 keyBoard down 返回true.
     * @param keyBoard 
     * @returns 
     */
    isKeyDown(...keyBoard: KeyBoard[]): boolean{

      for(let i =0; i< keyBoard.length; i++ ){
        if(!this.isKeysDownMap[keyBoard[i]]) return false
      }
      return true;
    };

    /**
     * 所有 keyboard up 返回true.
     * @param keyBoard 
     * @returns 
     */
    isKeyUp(...keyBoard: KeyBoard[]): boolean{
      for(let i =0; i< keyBoard.length; i++ ){
        if(this.isKeysDownMap[keyBoard[i]]) return false
      }
      return true;
    };

    afterUpdated = () => {
      this.hasKeysDown= {}
      this.hasKeysUp = {}
    }

    // onKeyDown(fun: Function, ...keyBoard: KeyBoard[]): void{
    //     fun();
    // };

    // onKeyUp( fun: Function, ...keyBoard: KeyBoard[]): void{
    //     fun();
    // };

    triggerInputEvent( inputType: InputType,inputEvent: InputEvent): void {
        
        if(inputType === InputType.keyUp){
            this.handleKeyUp(inputEvent.Key);
        }else if(inputType === InputType.KeyDown){
            this.handleKeyDown(inputEvent.Key);
        }
    };
}