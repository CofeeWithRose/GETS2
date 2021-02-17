import { AbstractComponent } from "../../core/implement/AbstractComponent";
import AbstractComponentLoader from "../../core/implement/AbstractComponentLoader";
import AbstractComponentLoaderInterface from "../../core/interface/AbstractComponentLoaderInterface";
import { GameObject } from "../../managers/gameobject/implement/data/GameObject";
import TimerManager from "../../managers/timer/implement/TimerManager";
import { GEEvents } from "../../util/enums/GEEvent";
import EventEmitor from "../../util/event/EventEmitor";

export interface Vec2 {
  readonly x: number
  readonly y: number
}

export interface TransformEvent {

  positionChange: (newPosition: Vec2, oldPosition: Vec2) => void

  scaleChange: (newScale: Vec2, oldScale: Vec2) => void

  rotationChange: (newRotation: number, oldRotation: number) => void
}

export class Transform extends AbstractComponent {

  private position: Vec2

  private scale: Vec2

  private rotation: number

  private eventEnitor: EventEmitor = new EventEmitor()

  protected parentTransform: Transform


  protected initRelativeScale: Vec2



  init = (
    position = { x: 0, y: 0 },
    scale = { x: 1, y: 1 },
    rotation = 0,
  ) => {
    this.position = position
    this.scale = scale
    this.rotation = rotation
  }

  awake = () => {
    // this.GameObject.on('addChild', this.handleChild)
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
       
        console.log('scaledX', newScale.x, distX)
        transform.setPosition({
          x: this.position.x + distX * scaledX,
          y: this.position.y + distY * scaledY,
        })
      }
    })
    this.emit('scaleChange', newScale, this.scale)
    this.scale = newScale
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
    this.position = newPosition
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