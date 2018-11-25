import AbstractComponent from "../core/implement/AbstractComponent";
import AbstractMnager from "../core/implement/AbstractManager";
import Position2DComponent from "../components/position2D/implement/Position2DComponent";

 export default{
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
        // {
        //     methodName: 'render',
        //     scope: [ Render2DComponent ],
        // },
        {
            methodName: 'updated',
            scope: [ AbstractComponent, AbstractMnager ],
        },
        {
            methodName: 'afterUpdated',
            scope: [ Position2DComponent ],
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