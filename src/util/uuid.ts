export class Uuid{

    private static id: number = 0;

    public static getUuid(){
        return this.id++;
    }
    
}