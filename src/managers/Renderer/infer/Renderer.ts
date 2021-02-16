import { AbstractManagerInterface } from "../../../core/interface/AbstractManagerInterface";

export interface RendererInfer extends AbstractManagerInterface {

    
} 

export interface RendererCfg {

    canvas: HTMLCanvasElement

    maxSize: number
}