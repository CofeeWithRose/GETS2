import GE from "./core/implement/GE";
import { ManagerNameSpaces, ComponentNameSpace } from "./util/enums/NameSpaces";
import TimerManager from "./managers/timer/implement/TimerManager";
import Position2DComponent from "./components/position2D/implement/Position2DComponent";
import GameObject from "./managers/gameobject/implement/data/GameObject";
import InputManager from "./managers/input/implement/InputManager";
import GameObjectManager from "./managers/gameobject/implement/GameObjectManager";

const config = {
    managerInfoArray:[
        {
            managerNameSpace: ManagerNameSpaces.TimerManager,
            manager: TimerManager,
            config: {},
        },
        {
            managerNameSpace: ManagerNameSpaces.InputManager,
            manager: InputManager,
            config: {},
        },
        {
            managerNameSpace: ManagerNameSpaces.GameObjectManager,
            manager: GameObjectManager,
            config: {},
        },
    ],
    componentInfoArray:[
        {
            componentNameSpace: ComponentNameSpace.POSITION_2D,

            componentClass: Position2DComponent,
        }
    ],
}

GE.init(config);
// GE.getManager()
const gO = new GameObject();
gO.addComponent(ComponentNameSpace.POSITION_2D);
console.log(  gO.getComponent(ComponentNameSpace.POSITION_2D).ComponentNameSpace);
// GE.instanceComponentLoader(gO);