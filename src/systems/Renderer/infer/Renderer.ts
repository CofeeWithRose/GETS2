import { Vec2 } from "../../../components/Transform";
import { AbstractSystemInterface } from "../../../core/interface/AbstractSystemInterface";


export interface SpiritAttr {
  position?: Vec2
  sourceId?: number
  scale?: Vec2
  rotation?: number
}

export interface RendererInfer extends AbstractSystemInterface {

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