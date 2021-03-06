import { Uuid } from "../../util/uuid";

export default abstract class AbstractGEObject {
    
    protected id = Uuid.getUuid();

    get Id(){
        return this.id;
    }
}

export interface AbstractGEObjectConstructor {
  new (...params: any): AbstractGEObject
}