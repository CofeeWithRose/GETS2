import { AbstractMnager } from "../../../core/implement/AbstractManager";
import { RendererCfg, RendererInfer } from "../infer/Renderer";
import {IRender} from 'i-render'
import { GE } from "../../../core/implement/GE";

export class Renderer extends AbstractMnager implements RendererInfer {

    private irender: IRender

    constructor(game:GE,config: RendererCfg) {
        super(game, config);
        this.irender = new IRender(config.canvas, { maxNumber:  config.maxSize })
    }

    
}