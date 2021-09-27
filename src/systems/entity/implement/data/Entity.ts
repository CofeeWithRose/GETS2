import AbstractComponentLoader from "../../../../core/implement/AbstractComponentLoader";
import {GE} from "../../../../core/implement/GE";
import { GEEvents } from "../../../../util/enums/GEEvent";

export interface EntityOptions {
    tag?: string
    name?: string
    hadLoaded: boolean
}
const defaultOptions: EntityOptions = {
    hadLoaded: false
}
export  class Entity extends AbstractComponentLoader {

    constructor(world: GE, options?:EntityOptions) {
        super(world);
        options = {...defaultOptions, ...options}
        this.hasLoaded = options.hadLoaded
        this.name = options.name
        this.tag = options.tag
        this.world.sendMessage( GEEvents.ADD_ENTITY, this );
    }

    get Parent(): Entity{
        return this.parent
    }

    addChildren(obj: Entity): void {
        if(obj.parent) throw new Error('repeat load')
        obj.hasLoaded = true
        this.children.push(obj)
        obj.parent = this
        obj.loadOffineComponents()
        this.emit('addChild', obj)
    }


    removeChildren(obj: Entity): void {
        const ind = this.children.indexOf(obj)
        if(ind > -1) {
            this.children.splice(ind, 1)
            obj.hasLoaded = false
        }
        this.emit('removeChild', obj)
    }

    findChildren(id: number): Entity {
        return this.children.find( ({Id}) => Id === id )
    }

    destory = () => {
        const objs: Entity[] = [this]
        for(let i =0 ;i< objs.length; i++) {
            objs.push(...objs[i].children)
        }
        objs.reverse().forEach( obj => {
            if(obj.hasDestroy) return
            obj.hasDestroy = true
            obj.removeAllComponents()
            obj.world.sendMessage( GEEvents.REMOVE_Entity, obj);
            const slib = obj.parent.Children
            const index = slib.indexOf(obj)
            if(index >-1) slib.splice(index, 1)
        })
    };



}


