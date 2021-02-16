import { AbstractMnager } from "../../../core/implement/AbstractManager";
import { RendererCfg, RendererInfer } from "../infer/Renderer";
import {IRender, Vec2} from 'i-render'
import { GE } from "../../../core/implement/GE";
import { Ielement } from "_i-render@0.0.15@i-render/lib/src/Ielement/IElement";

export class Renderer extends AbstractMnager implements RendererInfer {

    private irender: IRender

    private loadedSourceRecord = new Map<string, Promise<number>>()

    private spiriteMap = new Map<string, Ielement>()


    private spiriteId = 0

    constructor(game:GE, config: RendererCfg) {
        super(game, config);
        this.irender = new IRender(config.canvas, { maxNumber:  config.maxSize })
    }

    craeteSpirit(sourceId: number, position: Vec2 ): string {
      const spirit =  this.irender.createElement({
        imgId: sourceId,
        position,
      })
      const id = `spirit_${++this.spiriteId}`
      this.spiriteMap.set(id, spirit)
      return id
    }

    destroySpirit(spiritId: string) {
      const spirit = this.spiriteMap.get(spiritId)
      this.spiriteMap.delete(spiritId)
      this.irender.destoryElement(spirit)
      // TODO handle clean source.
    }

    updateSpirit(spiriteId: string, position?: Vec2 ){
      const spirite = this.spiriteMap.get(spiriteId)
      if(spirite) {
        if(position) spirite.setPosition(position.x, position.y)
      }
    }

    async loadSource(url: string): Promise<number>{
     let promise = this.loadedSourceRecord.get(url)
     if(promise) return promise
      promise =  new Promise<number>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          resolve(this.irender.loadImg(img))
        }
        img.onerror = reject
        img.src = url
      })
      this.loadedSourceRecord.set(url, promise)
      return promise
    }

    

}