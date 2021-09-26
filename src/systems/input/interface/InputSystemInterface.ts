import {AbstractSystemInterface} from "../../../core/interface/AbstractSystemInterface";
import { KeyBoard, InputType } from "./data/enum";
import InputEvent from "./data/InputEvent";

export default interface InputSystemInterface extends AbstractSystemInterface {

    keyDown(keyBoard: KeyBoard): boolean;

    keyUp(keyBoard: KeyBoard): boolean;

    isKeyDown(keyBoard: KeyBoard): boolean;

    isKeyUp(keyBoard: KeyBoard): boolean;

    updated():void;
    /**
     * 
     * @param eventType 
     * @param inputEvent 
     */
    triggerInputEvent(eventType:InputType, inputEvent: InputEvent ):void;

}