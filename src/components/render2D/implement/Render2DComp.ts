import AbstractComponent from "../../../core/implement/AbstractComponent";
import { Render2DCompInfer } from "../interface/render2DCompInfer";

export class Render2DComp extends AbstractComponent implements Render2DCompInfer {

  constructor(public x: number){
    super()
  }

  awake(){
      console.log('Render2DComp awake')
  }
  destory(){
    console.log('Render2DComp destory')
  }
}