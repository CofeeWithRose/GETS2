import {AbstractComponent} from "../core/implement/AbstractComponent";
import {AbstractMnager} from "../core/implement/AbstractManager";
import TaskMnagerConfigInterface from "../managers/task/interface/config/TaskMnagerConfigInterface";

 export const taskConig: TaskMnagerConfigInterface = {
    start: [
        {
          methodName: 'init',
          scope: [ AbstractMnager ],
        },
        {
            methodName: 'awake',
            scope: [ AbstractComponent ],
        },
        {
            methodName: 'start',
            scope: [ AbstractComponent ],
        },
    ],
    loop: [
        {
          methodName: 'beforeUpdate',
          scope: [ AbstractMnager ],
        },
        {
            methodName: 'willUpdate',
            scope: [ AbstractComponent, AbstractMnager],
        },
        {
            methodName: 'update',
            scope: [ AbstractMnager, AbstractComponent ],
        },
        {
            methodName: 'updated',
            scope: [ AbstractComponent, AbstractMnager ],
            sequence: 'negative',
        },
        {
            methodName: 'afterUpdated',
            scope: [ AbstractMnager ],
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