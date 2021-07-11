import { AbstractComponent } from "../../core/implement/AbstractComponent";
import EventEmitor from "../../util/event/EventEmitor";
import {AbstractComponentLoaderInterface} from "../../core/interface/AbstractComponentLoaderInterface";
import { ComponentInstance, FunComponent } from "../../core/interface/AbstractComponentInterface";
import { GE } from "src/core/implement/GE";
import EventEmitor2 from "../../util/event/EventEmitor2";

export interface Vec2 {
  x: number
  y: number
}

export interface TransformEvent {

  positionChange: (x: number, y:number) => void

  scaleChange: (newScale: Vec2, oldScale: Vec2) => void

  rotationChange: (newRotation: number, oldRotation: number) => void

  transformChange: (newPosition: Vec2, newRotation: number, newScale: Vec2 ) => void
}

export interface TransformInfer {

  getRotation(): number

  setRotation(newRotation: number): void

  getScale(): Readonly<Vec2>

  setScale(newScale: Vec2): void


  getPosition(): Readonly<Vec2>

  setPosition(x: number, y: number): void


  on<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void

  off<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void
}

export const Transform: FunComponent<TransformInfer> =  function TransFormFun(
  ge, obj,  
  position = { x: 0, y: 0 },
  scale = { x: 1.0, y: 1.0 },
  rotation = 0.0
) {
    const _eventEnitor = EventEmitor()
    const _children = obj.Children
    position = {...position}
    scale = {...scale}
    const emit = _eventEnitor.emit.bind(_eventEnitor) as <E extends keyof TransformEvent>(eventName: E, ...params: Parameters<TransformEvent[E]>) => void

    function on<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void {
      _eventEnitor.addEventListener(eventName, cb)
    }
  
    function off<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void {
      _eventEnitor.removeEventListener(eventName, cb)
    }
    function getRotation(){
      return rotation
    }

    function setRotation(newRotation: number) {
      newRotation = newRotation%360
      _children.forEach(c => {
        const childTransform = c.getComponent(TransFormFun)
        if (childTransform) {
          const childRotation = childTransform.getRotation()
          const deltaRotation  = newRotation - rotation
          childTransform.setRotation(childRotation + deltaRotation)
  
          const childPosition = childTransform.getPosition()
          const distX = childPosition.x - position.x
          const distY = childPosition.y - position.y
          const dist = Math.sqrt(  Math.pow(distX, 2) +  Math.pow(distY, 2) )
          const radians = Math.atan2(distY, distX)
          const updatedRadians = radians + (deltaRotation / 180) * Math.PI
          childTransform.setPosition(
            position.x +  Math.cos(updatedRadians) * dist,
            position.y + Math.sin(updatedRadians) * dist
          )
        }
      })
      emit('rotationChange', newRotation, rotation)
      emit('transformChange', position, newRotation, scale )
      rotation = newRotation
    }

    function getScale(): Readonly<Vec2> {
      return scale
    }
    function setScale(newScale: Vec2) {
      _children.forEach((child) => {
        const transform = child.getComponent(TransFormFun)
        if (transform) {
          const childScale = transform.getScale()

          const scaledX = newScale.x/transform.scale.x
          const scaledY = newScale.y/transform.scale.y
          transform.setScale({
            x: childScale.x * scaledX,
            y: childScale.y * scaledY,
          })

          const childPosition = transform.getPosition()
          const distX = childPosition.x - transform.position.x
          const distY = childPosition.y - transform.position.y
          // const angle = transform.rotation/
        
          transform.setPosition(
            transform.position.x + distX * scaledX,
            transform.position.y + distY * scaledY,
          )
        }
      })
      emit('scaleChange', newScale, scale)
      emit('transformChange', position, rotation, newScale)
      scale.x = newScale.x
      scale.y = newScale.y
    }
    function  getPosition(): Readonly<Vec2> {
      return position
    }
    function setPosition(x: number, y: number) {
      
      _children.forEach(c => {
        const transform = c.getComponent(TransFormFun)
        if (transform) {
          const postion = transform.getPosition()
          transform.setPosition(
            postion.x + x - transform.position.x,
            postion.y + y - transform.position.y,
          )
        }
      })
    
      emit('positionChange', x, y)
      position.x = x
      position.y = y
      emit('transformChange', position, rotation, scale)
    
    }


  return {
    getPosition,
    setPosition,
    getRotation,
    position,
    getScale,
    setScale,
    scale,
    setRotation,
    rotation,
    on, off,
  }
}
