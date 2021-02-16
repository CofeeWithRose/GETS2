import { Uuid } from "../../util/uuid";

export default class AbstractGEObject {
    
    private id = Uuid.getUuid();

    get Id(){
        return this.id;
    }
}