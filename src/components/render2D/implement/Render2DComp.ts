import AbstractComponent from "../../../core/implement/AbstractComponent";
import { injectComponentNameSpace } from "../../../util/decorators/NameSpace";
import { ComponentNameSpace } from "../../../util/enums/NameSpaces";
import { Render2DCompInfer } from "../interface/render2DCompInfer";

@injectComponentNameSpace(ComponentNameSpace.RENDERER_2D)
export class Render2DComp extends AbstractComponent implements Render2DCompInfer {

  awake(){
      console.log('Render2DComp awake')
  }
  destory(){
    console.log('Render2DComp destory')
  }
}