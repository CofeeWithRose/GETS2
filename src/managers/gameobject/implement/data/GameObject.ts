import AbstractComponentLoader from "../../../../core/implement/AbstractComponentLoader";
import {GE} from "../../../../core/implement/GE";
import { GEEvents } from "../../../../util/enums/GEEvent";

export  class GameObject extends AbstractComponentLoader {

    constructor(game: GE) {
        super(game);
        game.sendMessage( GEEvents.ADD_GAMEOBJECT, this);
    }

    get Parent(): GameObject{
        return this.parent
    }

    addChildren(obj: GameObject): void {
        this.children.push(obj)
        obj.parent = this
        this.emit('addChild', obj)
    }

    removeChildren(obj: GameObject): void {
        const ind = this.children.indexOf(obj)
        if(ind > -1) this.children.splice(ind, 1)
        this.emit('removeChild', obj)
    }

    findChildren(id: number): GameObject {
        return this.children.find( ({Id}) => Id === id )
    }

    destory = () => {
        this.children.forEach( c => c.destory() )
        this.removeAllComponents()
        this.game.sendMessage( GEEvents.REMOVE_GAMEOBJECT, this);
    };


}


