import {AbstractComponent} from "../core/implement/AbstractComponent";
import {AbstractSystem} from "../core/implement/AbstractSystem";
import TaskMnagerConfigInterface from "../systems/task/interface/config/TaskMnagerConfigInterface";

 export const taskConig: TaskMnagerConfigInterface = {
    start: [
        {
            methodName: 'start',
            scope: [AbstractSystem, AbstractComponent ],
        },
    ],
    loop: [
        {
            methodName: 'update',
            scope: [ AbstractSystem ],
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
    ],
}