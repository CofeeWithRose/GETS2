import { KeyBoard } from "./enum";

export default class InputEvent {
    constructor(key: KeyBoard){
        this.key = key;
    }
    private key:KeyBoard;

    private GEID: string;

    get Key(){
        return this.key;
    }
};