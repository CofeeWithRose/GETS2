import {AbstractComponent} from "../core/implement/AbstractComponent";
import {AbstractSystem} from "../core/implement/AbstractSystem";
import TaskMnagerConfigInterface from "../managers/task/interface/config/TaskMnagerConfigInterface";

 export const taskConig: TaskMnagerConfigInterface = {
    start: [
        {
          methodName: 'init',
          scope: [ AbstractSystem ],
        },
        {
            methodName: 'awake',
            scope: [ AbstractComponent ],
        },
        {
            methodName: 'start',
            scope: [AbstractSystem, AbstractComponent ],
        },
    ],
    loop: [
        {
          methodName: 'beforeUpdate',
          scope: [ AbstractSystem ],
        },
        {
            methodName: 'willUpdate',
            scope: [ AbstractComponent, AbstractSystem],
        },
        {
            methodName: 'update',
            scope: [ AbstractSystem, AbstractComponent ],
        },
        {
            methodName: 'updated',
            scope: [ AbstractComponent, AbstractSystem ],
            sequence: 'negative',
        },
        {
            methodName: 'afterUpdated',
            scope: [ AbstractSystem ],
        },
    ],
    end: [
        {
            methodName: 'destroy',
            scope: [ AbstractComponent ],
        },
        {
            methodName: 'destroyed',
            scope: [ AbstractComponent ],
        },
    ],
}