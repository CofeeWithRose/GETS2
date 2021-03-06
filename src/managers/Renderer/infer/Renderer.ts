import { Vec2 } from "../../../components/Transform";
import { AbstractManagerInterface } from "../../../core/interface/AbstractManagerInterface";


export interface SpiritAttr {
  position?: Vec2
  sourceId?: number
  scale?: Vec2
  rotation?: number
}

export interface RendererInfer extends AbstractManagerInterface {

  craeteSpirit(sourceId: number, attr: SpiritAttr ): string

  destroySpirit(spiriteId: string): void

  updateSpirit(spiriteId: string, attr: SpiritAttr): void

  /**
   * 
   * @param url 
   * @returns source id
   */
  loadSource(url: string): Promise<number>

  
} 

export interface RendererCfg {

    canvas: HTMLCanvasElement

    maxSize: number
}