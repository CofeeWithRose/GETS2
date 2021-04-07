import {AbstractManagerInterface} from "../../../core/interface/AbstractManagerInterface";
import { KeyBoard, InputType } from "./data/enum";
import InputEvent from "./data/InputEvent";

export default interface InputManagerInterface extends AbstractManagerInterface {

    keyDown(...keyBoard: KeyBoard[]): boolean;

    keyUp(...keyBoard: KeyBoard[]): boolean;

    isKeyDown(...keyBoard: KeyBoard[]): boolean;

    isKeyUp(...keyBoard: KeyBoard[]): boolean;

    // onKeyDown(fun: Function, ...keyBoard: KeyBoard[] ): void;

    // onKeyUp( fun: Function, ...keyBoard: KeyBoard[] ): void;

    updated():void;
    /**
     * 
     * @param eventType 
     * @param inputEvent 
     */
    triggerInputEvent(eventType:InputType, inputEvent: InputEvent ):void;

}