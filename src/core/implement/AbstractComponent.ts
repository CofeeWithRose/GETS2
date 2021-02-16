import AbstractGEObject from "./AbstractGEObject";
import {AbstractComponentInterface} from "../interface/AbstractComponentInterface";
import AbstractComponentLoaderInterface from "../interface/AbstractComponentLoaderInterface";
import {GE} from "./GE";
import { AbstractManagerConstructor, AbstractManagerInterface } from "../interface/AbstractManagerInterface";

export class AbstractComponent extends AbstractGEObject implements AbstractComponentInterface {
  

    private componentLoader: AbstractComponentLoaderInterface;

    protected game: GE

    constructor(game: GE){
        super()
        this.game = game
    }

    reset(){}


    get GameObject(){
        return this.componentLoader;
    };

    set GameObject(componentLoader: AbstractComponentLoaderInterface){
        this.componentLoader = componentLoader;
    }

    getManager<C extends AbstractManagerConstructor<any[]>>(managerConstructor: C): InstanceType<C>{
        return this.game.getManager( managerConstructor);
    }

    destory(){}

};