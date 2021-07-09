import { AbstractComponent } from "../../core/implement/AbstractComponent";
import EventEmitor from "../../util/event/EventEmitor";
import {AbstractComponentLoaderInterface} from "../../core/interface/AbstractComponentLoaderInterface";

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

export class Transform extends AbstractComponent {

  private position: Vec2 = {x:0, y: 0}

  private scale: Vec2 = { x: 1.0, y: 1.0}

  private rotation: number = 0.0

  private eventEnitor: EventEmitor = new EventEmitor()

  private children: AbstractComponentLoaderInterface[]


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

  start = () => {
    this.children = this.GameObject.Children

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
        transform.setPosition(
          this.position.x +  Math.cos(updatedRadians) * dist,
          this.position.y + Math.sin(updatedRadians) * dist
        )
      }
    })
    this.emit('rotationChange', newRotation, this.rotation)
    this.emit('transformChange', this.position, newRotation, this.scale )
    this.rotation = newRotation
  }

  getScale(): Readonly<Vec2> {
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
       
        transform.setPosition(
          this.position.x + distX * scaledX,
          this.position.y + distY * scaledY,
        )
      }
    })
    this.emit('scaleChange', newScale, this.scale)
    this.emit('transformChange', this.position, this.rotation, newScale)
    // this.scale = newScale
    this.scale.x = newScale.x
    this.scale.y = newScale.y
  }


  getPosition(): Readonly<Vec2> {
    return this.position
  };

  setPosition(x: number, y: number) {
    
    this.children.forEach(c => {
      const transform = c.getComponent(Transform)
      if (transform) {
        const postion = transform.getPosition()
        transform.setPosition(
          postion.x + x - this.position.x,
          postion.y + y - this.position.y,
        )
      }
    })
  
    this.emit('positionChange', x, y)
    this.position.x = x
    this.position.y = y
    this.emit('transformChange', this.position, this.rotation, this.scale)
   
  };

  protected emit: <E extends keyof TransformEvent>(eventName: E, ...params: Parameters<TransformEvent[E]>) => void = this.eventEnitor.emit.bind(this.eventEnitor)

  on<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void {
    this.eventEnitor.addEventListener(eventName, cb)
  }

  off<E extends keyof TransformEvent>(eventName: E, cb: TransformEvent[E]): void {
    this.eventEnitor.removeEventListener(eventName, cb)
  }
}
