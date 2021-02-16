import AbstractComponent from "../../../core/implement/AbstractComponent";
import { GE } from "../../../core/implement/GE";
import { Render2DCompInfer } from "../interface/render2DCompInfer";

export class Render2DComp extends AbstractComponent implements Render2DCompInfer {


  awake(){
      console.log('Render2DComp awake')
  }
  
  destory(){
    console.log('Render2DComp destory')
  }
}