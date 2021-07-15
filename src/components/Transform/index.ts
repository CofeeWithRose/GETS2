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

// TODO remove event infer.
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

  positionChanged: boolean,
  
  rotationChanged: boolean,
  
  scaleChanged: boolean

  position: Vec2
  scale:Vec2
  rotation: number

}

export const Transform: FunComponent<TransformInfer> =  function TransFormFun(
  ge, obj,  
  positionParam: Vec2 = { x: 0, y: 0 },
  scale = { x: 1.0, y: 1.0 },
  rotation = 0.0
) {
    const _eventEnitor = EventEmitor2()
    const _children = obj.Children
    const position: Vec2 = {x: positionParam.x, y: positionParam.y}
    scale = {...scale}
    const transform: Partial<TransformInfer> = {
      positionChanged: false,
      rotationChanged:false,
      scaleChanged:false
    }

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
      transform.rotation = newRotation
      transform.rotationChanged = true
    }

    function getScale(): Readonly<Vec2> {
      return scale
    }
    function setScale(newScale: Vec2) {
      _children.forEach((child) => {
        const _transform = child.getComponent(TransFormFun)
        if (_transform) {
          const childScale = _transform.getScale()

          const scaledX = newScale.x/_transform.scale.x
          const scaledY = newScale.y/_transform.scale.y
          _transform.setScale({
            x: childScale.x * scaledX,
            y: childScale.y * scaledY,
          })

          const childPosition = _transform.getPosition()
          const distX = childPosition.x - _transform.position.x
          const distY = childPosition.y - _transform.position.y
          // const angle = transform.rotation/
        
          _transform.setPosition(
            _transform.position.x + distX * scaledX,
            _transform.position.y + distY * scaledY,
          )
        }
      })
      emit('scaleChange', newScale, scale)
      emit('transformChange', position, rotation, newScale)
      scale.x = newScale.x
      scale.y = newScale.y
      transform.scaleChanged = true
      
    }
    function  getPosition(): Readonly<Vec2> {
      return position
    }
    function setPosition(x: number, y: number) {
      
      _children.forEach(c => {
        const _transform = c.getComponent(TransFormFun)
        if (_transform) {
          const postion = _transform.getPosition()
          _transform.setPosition(
            postion.x + x - _transform.position.x,
            postion.y + y - _transform.position.y,
          )
        }
      })
    
      // emit('positionChange', x, y)
      position.x = x
      position.y = y
      // emit('transformChange', position, rotation, scale)
      transform.positionChanged = true
    }

    obj.regist('beforeUpdate', function beforeUpdate() {
      transform.positionChanged = false
      transform.rotationChanged = false
      transform.scaleChanged = false
    })

    transform.getPosition = getPosition,
    transform.setPosition = setPosition
    transform.getRotation = getRotation
    transform.position = position
    transform.getScale= getScale
    transform.setScale =  setScale
    transform.scale = scale
    transform.setRotation = setRotation,
    transform.rotation = rotation,
    transform.on = on
    transform.off = off
  return  transform as TransformInfer
}
