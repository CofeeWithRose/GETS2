
export default class Vector2D{
    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }
    private x: number;

    private y:number;

    get X(){
        return this.x;
    }

    get Y(){
        return this.y;
    }
}