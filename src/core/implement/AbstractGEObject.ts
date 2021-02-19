import { Uuid } from "../../util/uuid";

export default class AbstractGEObject {
    
    protected id = Uuid.getUuid();

    get Id(){
        return this.id;
    }
}