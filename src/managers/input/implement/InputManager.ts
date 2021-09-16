import {AbstractMnager} from "../../../core/implement/AbstractManager";
import InputManagerInterface from "../interface/InputManagerInterface";
import AbstractManagerConfig from "../../../core/interface/AbstractManagerConfig";
import { KeyBoard, InputType } from "../interface/data/enum";
import InputEvent from "../interface/data/InputEvent";
import { GE } from "../../../core/implement/GE";

export interface InputConfig {
    // 需要 preventDefault的按键.
    defaultKeys?: KeyBoard[]
}
export class InputManager extends AbstractMnager implements InputManagerInterface {

    constructor(game: GE,config: InputConfig){
        super(game, config);
        window.addEventListener('keydown', event => {
            const defaultKeys = config.defaultKeys||[]
            if(defaultKeys.includes(event.key as KeyBoard)) {
                event.preventDefault()
            }
            this.handleKeyDown(<KeyBoard>event.key);
        });

        window.addEventListener('keyup', event => {
            this.handleKeyUp(<KeyBoard>event.key);
          
        });
    };

    protected isKeysDownMap = new Map<string, boolean>();

    protected hasKeysDown = new Map<string, boolean>();

    protected hasKeysUp = new Map<string, boolean>();

    private handleKeyUp(key: KeyBoard){

        this.isKeysDownMap.set(key, false);
        this.hasKeysDown.set(key, false);
        this.hasKeysUp.set(key, false);
        
    };

    private handleKeyDown(key: KeyBoard){
        
        this.isKeysDownMap.set(key, true);
        this.hasKeysDown.set(key, true);
        this.hasKeysUp.set(key, true);
    };
    
    updated = () => {
        const downKeys = Object.keys(this.hasKeysDown);
        for(let i = 0; i< downKeys.length; i++){
            this.hasKeysDown.set(downKeys[i], false);
        }

        const upKeys = Object.keys(this.hasKeysUp);
        for(let i = 0; i< upKeys.length; i++){
            this.hasKeysUp.set(upKeys[i], false);
        }
    }

    keyDown(keyBoard: KeyBoard): boolean {
        return this.hasKeysDown.get(keyBoard);
    }

    /**
     * 任意一个 keyBoard up 返回 true.
     * 每个 keyBoard 一次 up 只触发一次true.
     * @param keyBoard 
     * @returns 
     */
    keyUp(keyBoard: KeyBoard): boolean{
      return this.hasKeysUp.get(keyBoard);
    }

    /**
     * 所有 keyBoard down 返回true.
     * @param keyBoard 
     * @returns 
     */
    isKeyDown(keyBoard: KeyBoard): boolean{
      return this.isKeysDownMap.get(keyBoard);
    };

    /**
     * 所有 keyboard up 返回true.
     * @param keyBoard 
     * @returns 
     */
    isKeyUp(keyBoard: KeyBoard): boolean{
      return !this.isKeysDownMap.get(keyBoard);
    };

    afterUpdated = () => {
      this.hasKeysDown.clear()
      this.hasKeysUp.clear()
    }

   
    triggerInputEvent( inputType: InputType,inputEvent: InputEvent): void {
        
        if(inputType === InputType.keyUp){
            this.handleKeyUp(inputEvent.Key);
        }else if(inputType === InputType.KeyDown){
            this.handleKeyDown(inputEvent.Key);
        }
    };
}