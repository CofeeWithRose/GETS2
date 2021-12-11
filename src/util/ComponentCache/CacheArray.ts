export class CacheArray<T> {

    protected array: T[] = []
    /**
     * 当前正在遍历的index.
     */
    protected curIndex = 0
    
    /**
     * 去重添加.
     */
    add(value: T){
        const index = this.array.indexOf(value)
        if(index < 0) this.array.push(value)
    }
    delete(value: T){
        const deleteIndex =  this.array.indexOf(value)
        if(deleteIndex > -1) {
            this.array.splice(deleteIndex, 1)
            if(deleteIndex <= this.curIndex) {
                this.curIndex--
            }
        }
    }

    forEach(callback: (value: T) => void ){
        for(this.curIndex = 0; this.curIndex < this.array.length; this.curIndex++) {
            callback(this.array[this.curIndex])
        }
    }

    get(index: number) {
        return this.array[index]
    }

    size() {
        return this.array.length
    }
}