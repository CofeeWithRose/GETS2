import { 
    FunComponent, Transform 
} from "ge";

export const AutoMove: FunComponent<void> = function AutoMove(ge, obj, maxX:number, maxY: number, speed: number) {

    obj.regist('start', () => {
        const _transform = obj.getComponent(Transform)

        const _position = _transform.getPosition()
        const _v = { x:10,y:10 }

        obj.regist('update', function update() {
            if(_position.x <0) {
                _v.x = speed
            } else if (_position.x >maxX){
                _v.x = -speed
            }

            if(_position.y <0) {
                _v.y = speed
            } else if(_position.y >maxY) {
                _v.y = -speed
            }
            _transform.setPosition( _position.x + _v.x, _position.y + _v.y )
        })
    })
    return {}
    
}