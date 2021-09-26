export class Uuid{

    private static id: number = 1;

    public static getUuid(){
        return this.id++;
    }
    
}