interface AInfer {

}

interface AConstructor {
    new (): AInfer
}

class A implements AInfer {
   
}

function constructorA(constructor: AConstructor): AInfer{
   return new constructor()
}
