import AbstractComponentLoader from "../../../../core/implement/AbstractComponentLoader";
import {GE} from "../../../../core/implement/GE";
import { GEEvents } from "../../../../util/enums/GEEvent";

export  class GameObject extends AbstractComponentLoader {

    constructor(game: GE, hadLoaded = false) {
        super(game);
        game.sendMessage( GEEvents.ADD_GAMEOBJECT, this);
        this.hasLoaded = hadLoaded
    }

    get Parent(): GameObject{
        return this.parent
    }

    addChildren(obj: GameObject): void {
        if(obj.hasLoaded) throw new Error('repeat load')
        obj.hasLoaded = true
        this.children.push(obj)
        obj.parent = this
        obj.loadOffineComponents()
        this.emit('addChild', obj)
    }


    removeChildren(obj: GameObject): void {
        const ind = this.children.indexOf(obj)
        if(ind > -1) {
            this.children.splice(ind, 1)
            obj.hasLoaded = false
        }
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


