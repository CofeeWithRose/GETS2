export default class ArraySet<T>{

    private array = new Array<T>();

    add(value: T): number {
        let index = this.array.indexOf(value);
        if (index === -1) {
            this.array.push(value);
        }
        return index;
    };
    contains(value: T):boolean {
        return this.array.indexOf(value) > -1;
    };
    
    get(index: number): T {
        return this.array[index];
    };

    concat(arraySet: ArraySet<T>): void{
        arraySet.map( item => {
            this.add(item);
        });
    };

    map(fun: { (item: T, index: number): any }): Array<any>{
        const array = [... this.array];
        return array.map( (item, index) => {
            return fun(item, index);
        });

    };

    remove(value: T): void{
        const index = this.array.indexOf(value);
        if( -1 !== index){
            this.array.splice(index, 1);
        }
    };

    valus():Array<T> {
        return [...this.array];
    }
}