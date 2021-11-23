import { 
    GE, createConfig, Transform, EntityManagerSystem
  } from 'ge'
import { useEffect } from 'react'

export default {
    title: 'Canvas2d Text',
    component: GetComponent,
}


export function GetComponent() {
    useEffect(() => {
        const world = new GE(createConfig())

        console.time('create')
        for(let i = 0; i< 10000; i++){
            const entity = world.craeteObj({}, {name: i+''})
            world.stage.addChildren(entity)
        }
        // console.log(world.stage.Children);
        
        console.timeEnd('create')
        console.time('get component')
        const ts = world.findComponents(Transform)
        console.timeEnd('get component')
        console.log(ts.length);

        const entities = world.findEntities(Transform)  
        console.time('destroy')
        for(let i = 0; i< entities.length; i++){
            const ei= entities[i]
            try{
                ei.destroy()
            }catch(e) {
                console.log(ei);
            }
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