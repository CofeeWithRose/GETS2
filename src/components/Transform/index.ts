import { AbstractComponent } from "../../core/implement/AbstractComponent";
import EventEmitor from "../../util/event/EventEmitor";
import {AbstractComponentLoaderInterface} from "../../core/interface/AbstractComponentLoaderInterface";
import { FunComponent } from "../../core/interface/AbstractComponentInterface";
import { GE } from "src/core/implement/GE";

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
  const eventEnitor = new EventEmitor()
  const transform = {
    rotation: rotation,
    position: {...position},
    scale: {...scale},
    emit: eventEnitor.emit.bind(eventEnitor) as <E extends keyof TransformEvent>(eventName: E, ...params: Parameters<TransformEvent[E]>) => void,

    on<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void {
      eventEnitor.addEventListener(eventName, cb)
    },
  
    off<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void {
      eventEnitor.removeEventListener(eventName, cb)
    },
    getRotation(){
      return transform.rotation
    },
    setRotation(newRotation: number) {
      newRotation = newRotation%360
      obj.Children.forEach(c => {
        const childTransform = c.getComponent(TransFormFun)
        if (childTransform) {
          const childRotation = childTransform.getRotation()
          const deltaRotation  = newRotation - transform.rotation
          childTransform.setRotation(childRotation + deltaRotation)
  
          const childPosition = childTransform.getPosition()
          const distX = childPosition.x - transform.position.x
          const distY = childPosition.y - transform.position.y
          const dist = Math.sqrt(  Math.pow(distX, 2) +  Math.pow(distY, 2) )
          const radians = Math.atan2(distY, distX)
          const updatedRadians = radians + (deltaRotation / 180) * Math.PI
          childTransform.setPosition(
            transform.position.x +  Math.cos(updatedRadians) * dist,
            transform.position.y + Math.sin(updatedRadians) * dist
          )
        }
      })
      transform.emit('rotationChange', newRotation, transform.rotation)
      transform.emit('transformChange', transform.position, newRotation, transform.scale )
      transform.rotation = newRotation
    },
    getScale(): Readonly<Vec2> {
      return transform.scale
    },
    setScale(newScale: Vec2) {
      obj.Children.forEach((child) => {
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
      transform.emit('scaleChange', newScale, transform.scale)
      transform.emit('transformChange', transform.position, transform.rotation, newScale)
      // transform.scale = newScale
      transform.scale.x = newScale.x
      transform.scale.y = newScale.y
    },
    getPosition(): Readonly<Vec2> {
      return transform.position
    },
    setPosition(x: number, y: number) {
      
      obj.Children.forEach(c => {
        const transform = c.getComponent(TransFormFun)
        if (transform) {
          const postion = transform.getPosition()
          transform.setPosition(
            postion.x + x - transform.position.x,
            postion.y + y - transform.position.y,
          )
        }
      })
    
      transform.emit('positionChange', x, y)
      transform.position.x = x
      transform.position.y = y
      transform.emit('transformChange', transform.position, transform.rotation, transform.scale)
    
    }
  }

  


  return transform
}
