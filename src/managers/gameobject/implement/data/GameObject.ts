import AbstractComponentLoader from "../../../../core/implement/AbstractComponentLoader";
import {GE} from "../../../../core/implement/GE";
import { GEEvents } from "../../../../util/enums/GEEvent";

export interface GameObjectOptions {
    tag?: string
    name?: string
    hadLoaded: boolean
}
const defaultOptions: GameObjectOptions = {
    hadLoaded: false
}
export  class GameObject extends AbstractComponentLoader {

    constructor(game: GE, options?:GameObjectOptions) {
        super(game);
        options = {...defaultOptions, ...options}
        this.hasLoaded = options.hadLoaded
        this.name = options.name
        this.tag = options.tag
        this.game.sendMessage( GEEvents.ADD_GAMEOBJECT, this );
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
        const parentChildren = this.parent.Children
        const index = parentChildren.indexOf(this)
        if(index >-1) parentChildren.splice(index, 1)
        this.game.sendMessage( GEEvents.REMOVE_GAMEOBJECT, this);
    };



}


