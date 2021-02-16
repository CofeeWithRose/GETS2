import AbstractComponentLoader from "../../../../core/implement/AbstractComponentLoader";
import GameObjectInterface from "../../interface/data/GameObjectInterface";
import {GE} from "../../../../core/implement/GE";
import { GEEvents } from "../../../../util/enums/GEEvent";
import { AbstractComponentLoaderEvent } from "../../../../core/interface/AbstractComponentLoaderInterface";
import EventEmitor from "../../../../util/event/EventEmitor";

export  class GameObject extends AbstractComponentLoader implements GameObjectInterface {

    constructor(game: GE) {
        super(game);
        game.sendMessage( GEEvents.ADD_GAMEOBJECT, this);
    }

    protected eventEmiter = new EventEmitor()

    protected parent: GameObject

    protected children: GameObjectInterface[] = []
    
    get Parent(): GameObjectInterface{
        return this.parent
    }

    addChildren(obj: GameObject): void {
        this.children.push(obj)
        obj.parent = this
    }

    
    removeChildren(obj: GameObjectInterface): void {
        const ind = this.children.indexOf(obj)
        if(ind > -1) this.children.splice(ind, 1)
    }

    findChildren(id: number): GameObjectInterface {
        return this.children.find( ({Id}) => Id === id )
    }

    destory(){
        this.children.forEach( c => c.destory() )
        this.removeAllComponents()
        this.game.sendMessage( GEEvents.REMOVE_GAMEOBJECT, this);
    };

   
    on<E extends keyof AbstractComponentLoaderEvent >(
        eventName: E, cb: AbstractComponentLoaderEvent[E]
    ) :void {
        this.eventEmiter.addEventListener(eventName, cb)
    }


}