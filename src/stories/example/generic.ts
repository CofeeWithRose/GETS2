interface Melement { }

interface Person extends Melement {
    readonly type: string
}

interface Animal extends Melement {
    readonly type: string
}

class Student implements Person {
    readonly type = 'Student'

}

class Bird implements Animal {
    readonly type = 'bird'
}

class Manager {
    
    config = { PersonImplement: Student, AnimalImplament: Bird }

    // how to do this.
    add<M extends Melement>() {
       // when generic M is  Person , create Student instnce. when M is Animal ,create Bird.
    }

}

const manager = new Manager()
manager.add<Person>()
manager.add<Animal>()

get information about generic at runtime