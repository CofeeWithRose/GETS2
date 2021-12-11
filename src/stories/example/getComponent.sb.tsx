import { 
    GE, createConfig, TaskSystem,
  } from 'ge'
import { useEffect, useRef, useState } from 'react'
import { Test2ClassComponent } from './componnet/Test2ClassComponent'
import { TestClassComponent } from './componnet/TestClassComponent'
import { TestFunComponent } from './componnet/TestFunComponent'

export default {
    title: 'Canvas2d Text',
    component: GetComponent,
}


export function GetComponent() {

    const worldRef = useRef<GE>()
    const [ times, setTimes ] = useState({create: 0, get: 0, destory: 0})
    const { create, get, destory  } = times

    const testStart = function testStart(world:GE) {
        const startCreate= performance.now()
        for(let i = 0; i< 8000; i++){
            const entity = world.craeteObj({name: i+''})
            entity.addComponent(TestFunComponent, {})
            entity.addComponent(TestClassComponent, {})
            entity.addComponent(Test2ClassComponent, {})
            world.stage.addChildren(entity)
        }
        const endCreate = performance.now()
        return {startCreate, endCreate}
    }

    const testGet = function testGet(world:GE) {
        const startGet = performance.now()
        const ts = world.findComponents(TestFunComponent)
        const endGet = performance.now()
        return {startGet, endGet}
    }

    const testDestroy = function testDestroy(world:GE) {
        const entities = world.findEntities(TestFunComponent) 
        const startDestroy = performance.now()
        for (let index = 0; index < entities.length; index++) {
            const element = entities[index];
            element.destroy()
            index--
        }
        const endDestroy = performance.now()
        return {startDestroy, endDestroy}
    }

    const testTime = () => {
        const { current: world } = worldRef
        if(!world) return
        const {startCreate, endCreate} = testStart(world)
        const { startGet, endGet } = testGet(world)
        const { startDestroy, endDestroy} = testDestroy(world)
        setTimes({
            create: endCreate - startCreate,
            get: endGet - startGet,
            destory: endDestroy - startDestroy
        })        
    }

  
    useEffect(() => {
        worldRef.current = new GE(createConfig())
        worldRef.current.start()
    }, [])
    return <div>

        <h1>Test <button onClick={testTime} > test </button></h1>
        <p> create: {create}ms</p>
        <p>get component： {get}ms</p>
        <p>destroy：{destory}ms</p>


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