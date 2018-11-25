/**
 * 数字 set 访问器的装饰器，使得输入的数值在限制范文内.
 * @param min 
 * @param max 
 */
export function Ranger(min: number, max: number ) {
   
    return function(target: any, propKey: string, descriptor:TypedPropertyDescriptor<number> ){
        const set = descriptor.set.bind(target);

        descriptor.set = function(val: number){

            if(val < min){
                val = min;
            }
            if(val > max ){
                val = max;
            }
            set(val);
        }
        
    }
}

/**
 * 数字 set 访问器的装饰器，使得输入的数值乘以一个倍率.
 * @param scale 
 */
export function Scale( scale: number) {

    return function(target: any, propKey: string, descriptor:TypedPropertyDescriptor<number> ){
        const set = descriptor.set.bind(target);
        descriptor.set = function(val: number){
           val *=scale;
            set(val);
        }
        
    }
}