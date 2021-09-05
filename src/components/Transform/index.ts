import { GameObject } from "src/managers/gameobject/implement/data/GameObject";
import { FunComponent } from "../../core/interface/AbstractComponentInterface";

export interface Vec2 {
  x: number
  y: number
}

export interface TransformProps {
  position: Vec2,
  scale :Vec2,
  rotation : number
}

export interface TransformInfer {

  getRotation(): number

  setRotation(newRotation: number): void

  getScale(): Readonly<Vec2>

  setScale(newScale: Vec2): void

  getPosition(): Vec2

  setPosition(x: number, y: number): void

  positionChanged: number,
  
  rotationChanged: boolean,
  
  scaleChanged: boolean

  position: Vec2
  scale:Vec2
  rotation: number

  // offsetX: number

  // offsetY: number

}
const a = {
  positionParam: { x: 0, y: 0 },
  scale: { x: 1, y: 1.0 },
  rotation: 0.0
}
export const Transform: FunComponent<TransformInfer, Partial<TransformProps>> =  function TransFormFun(
  _, obj, props) {
    props = {
      position: { x: 0, y: 0 },
      scale: { x: 1, y: 1.0 },
      rotation: 0.0,
      ...props,
    }
    const { position: positionParam, scale, rotation } = props
    const _children = obj.Children
    const position: Vec2 = {x: positionParam.x, y: positionParam.y}
    const transform: Partial<TransformInfer> = {
      positionChanged: 1,
      rotationChanged:false,
      scaleChanged:false,
      // offsetX: 0,
      // offsetY: 0,
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
          _transform.setPosition(
            _transform.position.x + distX * scaledX,
            _transform.position.y + distY * scaledY,
          )
        }
      })
      scale.x = newScale.x
      scale.y = newScale.y
      transform.scaleChanged = true
      
    }
    function  getPosition(): Readonly<Vec2> {
      return position
    }
    function setPosition(x: number, y: number) {
      const dtx = x - position.x
      const dty = y - position.y
      const children: GameObject[] = [..._children]
      for(let i=0; i< children.length; i++) {
        const c = children[i]
        const _transform = c.transform?? c.getComponent(TransFormFun)
        const cpostion = _transform.getPosition()
        cpostion.x += dtx
        cpostion.y += dty
        _transform.positionChanged++
        children.push(...c.Children)
      }
      position.x = x
      position.y = y
      // transform.offsetX += dtx
      // transform.offsetY += dty
      transform.positionChanged++
    }

    obj.regist('start', () => {
      obj.transform = transform as TransformInfer
    })


    transform.getPosition = getPosition,
    transform.setPosition = setPosition
    transform.getRotation = getRotation
    transform.position = position
    transform.getScale= getScale
    transform.setScale =  setScale
    transform.scale = scale
    transform.setRotation = setRotation,
    transform.rotation = rotation
  return  transform as TransformInfer
}
