// interface PeopleInterface {

//     sex: string;

//     run(): void;

//     kiss(): void;
// };

// interface ManInterface extends PeopleInterface {
//     drink():void;
// }

// interface Animal {

//     bite(people: PeopleInterface): void;
// }



// /**
//  *  1
//  */
// class Animal {

//     bite(people: PeopleInterface){

//         const ph = <ManInterface>people;
//         ph.drink();
//         ph.run();
//         //....
//     }
// }
// /**
//  * 2
//  */
// class People implements PeopleInterface{

//     name = "pp";
//     sex = "man";
    
//     kiss():void {
//         console.log("kiss...");
//     };

//     run(){
//         console.log("run ....");
//     };
// };

// class Man extends People {
    
//     drink():void{
//         console.log("drink....");
//     };
// }

// /**
//  * 3
//  */
// const pengHao = new Man();

// const hhm = new People();

// const dog = new Animal();
// dog.bite(pengHao);
// //?
// // dog.bite(hhm);

// hhm.sex = "female";


// pengHao.kiss();
function Dectrator(t){
    
    return function(target, p2, p3) {
        const set = p3.set.bind(target);
        p3.set = function(val){
            console.log(t);
            val=t;
            set(val);
        }
    }
};

class A {

    private a = 0;

    @Dectrator(8)
    @Dectrator(9)
    set A(a:number){
        this.a = a;
    }
    
    getSome(   number: number){
        console.log('getSome: '+ number);
    }
}

new A().A=5;