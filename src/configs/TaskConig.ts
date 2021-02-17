import {AbstractComponent} from "../core/implement/AbstractComponent";
import {AbstractMnager} from "../core/implement/AbstractManager";

 export const taskConig = {
    start: [
        
        {
            methodName: 'awake',
            scope: [ AbstractComponent ],
        },
        {
            methodName: 'init',
            scope: [ AbstractMnager ],
        },
        {
            methodName: 'start',
            scope: [ AbstractComponent ],
        },

    ],
    loop: [

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