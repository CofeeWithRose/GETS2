import {AbstractSystemInterface} from "../../../core/interface/AbstractManagerInterface";
import { Entity } from "../implement/data/Entity";


export default interface EntityManagerSystemInterface extends AbstractSystemInterface {

    findEntityById(entityId: number): Entity;
    
}