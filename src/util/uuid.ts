export class Uuid{

    private static id: number = 1;

    private static entityId = 1
    
    public static getUuid(){
        return this.id++;
    }

    public static getEntityId() {
        return this.entityId++;
    }
    
}