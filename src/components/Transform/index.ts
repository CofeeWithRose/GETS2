import { AbstractComponent } from "../../core/implement/AbstractComponent";
import EventEmitor from "../../util/event/EventEmitor";
import AbstractComponentLoader from '../../core/implement/AbstractComponentLoader'
import { GE } from "GETS2/src/core/implement/GE";

export interface Vec2 {
  x: number
  y: number
}

export interface TransformEvent {

  positionChange: (newPosition: Vec2, oldPosition: Vec2) => void

  scaleChange: (newScale: Vec2, oldScale: Vec2) => void

  rotationChange: (newRotation: number, oldRotation: number) => void

  transformChange: (newPosition: Vec2, newRotation: number, newScale: Vec2 ) => void
}

export class Transform extends AbstractComponent {

  private position: Vec2 = {x:0, y: 0}

  private scale: Vec2 = { x: 1.0, y: 1.0}

  private rotation: number = 0.0

  private eventEnitor: EventEmitor = new EventEmitor()


  init = (
    position = { x: 0, y: 0 },
    scale = { x: 1.0, y: 1.0 },
    rotation = 0.0,
  ) => {
    this.position.x = position.x
    this.position.y = position.y
    this.scale.x = scale.x
    this.scale.y = scale.y
    this.rotation = rotation
  }


  // protected handleChild = (child: GameObject) => {
  //   const 
  // }

  

  getRotation(){
    return this.rotation
  }

  setRotation(newRotation: number) {
    newRotation = newRotation%360
    this.GameObject.Children.forEach(c => {
      const transform = c.getComponent(Transform)
      if (transform) {
        const childRotation = transform.getRotation()
        const deltaRotation  = newRotation - this.rotation
        transform.setRotation(childRotation + deltaRotation)

        const childPosition = transform.getPosition()
        const distX = childPosition.x - this.position.x
        const distY = childPosition.y - this.position.y
        const dist = Math.sqrt(  Math.pow(distX, 2) +  Math.pow(distY, 2) )
        const radians = Math.atan2(distY, distX)
        const updatedRadians = radians + (deltaRotation / 180) * Math.PI
        transform.setPosition({
          x: this.position.x +  Math.cos(updatedRadians) * dist,
          y: this.position.y + Math.sin(updatedRadians) * dist
        })
      }
    })
    this.emit('rotationChange', newRotation, this.rotation)
    this.emit('transformChange', this.position, newRotation, this.scale )
    this.rotation = newRotation
  }

  getScale() {
    return this.scale
  }

  setScale(newScale: Vec2) {
    this.GameObject.Children.forEach((child) => {
      const transform = child.getComponent(Transform)
      if (transform) {
        const childScale = transform.getScale()

        const scaledX = newScale.x/this.scale.x
        const scaledY = newScale.y/this.scale.y
        transform.setScale({
          x: childScale.x * scaledX,
          y: childScale.y * scaledY,
        })

        const childPosition = transform.getPosition()
        const distX = childPosition.x - this.position.x
        const distY = childPosition.y - this.position.y
        // const angle = this.rotation/
       
        transform.setPosition({
          x: this.position.x + distX * scaledX,
          y: this.position.y + distY * scaledY,
        })
      }
    })
    this.emit('scaleChange', newScale, this.scale)
    this.emit('transformChange', this.position, this.rotation, newScale)
    // this.scale = newScale
    this.scale.x = newScale.x
    this.scale.y = newScale.y
  }


  getPosition() {
    return this.position
  };

  setPosition(newPosition: Vec2) {
    
    this.GameObject.Children.forEach(c => {
      const transform = c.getComponent(Transform)
      if (transform) {
        const postion = transform.getPosition()
        transform.setPosition({
          x: postion.x + newPosition.x - this.position.x,
          y: postion.y + newPosition.y - this.position.y,
        })
      }
    })
    this.emit('positionChange', newPosition, this.position)
    this.emit('transformChange', newPosition, this.rotation, this.scale)
    this.position.x = newPosition.x
    this.position.y = newPosition.y
  };

  

  protected emit<E extends keyof TransformEvent>(eventName: E, ...params: Parameters<TransformEvent[E]>): void {
    this.eventEnitor.emit(eventName, ...params)
  }

  on<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void {
    this.eventEnitor.addEventListener(eventName, cb)
  }

  off<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void {
    this.eventEnitor.removeEventListener(eventName, cb)
  }
}
