import {AbstractComponent} from "../core/implement/AbstractComponent";
import {AbstractMnager} from "../core/implement/AbstractManager";

 export const taskConig = {
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
        },
        {
            methodName: 'afterUpdated',
            scope: [ AbstractMnager ],
        },
    ],
    end: [
        {
            methodName: 'destory',
            scope: [ AbstractComponent ],
        },
        {
            methodName: 'destroyed',
            scope: [ AbstractComponent ],
        },
    ],
}