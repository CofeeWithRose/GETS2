import { Vec2 } from "../../../components/position2D/interface/Position2DComponentInterface";
import { AbstractManagerInterface } from "../../../core/interface/AbstractManagerInterface";

export interface RendererInfer extends AbstractManagerInterface {

  craeteSpirit(sourceId: number, position: Vec2 ): string

  destroySpirit(spiriteId: string): void

  updateSpirit(spiriteId: string, position?: Vec2, sourceId?: number ): void

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