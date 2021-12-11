import { 
    GE, createConfig, EntityManagerSystem
  } from 'ge'
import { useEffect } from 'react'
import { TestClassComponent } from './componnet/TestClassComponent'
import { TestFunComponent } from './componnet/TestFunComponent'

export default {
    title: 'Canvas2d Text',
    component: GetComponent,
}


export function GetComponent() {
    useEffect(() => {
        const world = new GE(createConfig())

        console.time('create')
        for(let i = 0; i< 10000; i++){
            const entity = world.craeteObj({name: i+''})
            entity.addComponent(TestFunComponent, {})
            entity.addComponent(TestClassComponent, {})
            world.stage.addChildren(entity)
        }
        
        console.timeEnd('create')
        console.time('get component')
        const ts = world.findComponents(TestFunComponent)
        console.timeEnd('get component')
        console.log(ts.length);

        const entities = world.findEntities(TestFunComponent) 
        const l = entities.length
        if(l !== 10000) {
            throw 'error 1'
        }
        console.time('destroy')
        entities.forEach( ei => {
            ei.destroy()
        })
        console.log(entities.length);
        if(entities.length !== 0) {
            throw 'error 2'
        }
        console.timeEnd('destroy')
    }, [])
    return <div>

        <h1>before</h1>
        <p> create: 162.6ms</p>
        <p>get component： 3.8ms</p>
        <p>destroy：270.29ms</p>

        <h1>after</h1>
        <p>create: 165.5 ms</p>
        <p>get component：0.11 ms</p>
        <p>destroy：262.4 ms</p>

    </div>
}