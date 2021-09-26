import {AbstractSystemInterface} from "../../../core/interface/AbstractSystemInterface";
import { Entity } from "../implement/data/Entity";


export default interface EntityManagerSystemInterface extends AbstractSystemInterface {

    findEntityById(entityId: number): Entity;
    
}