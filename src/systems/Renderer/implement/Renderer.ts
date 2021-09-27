import { AbstractSystem } from "../../../core/implement/AbstractSystem";
import { RendererCfg, RendererInfer, SpiritAttr } from "../infer/Renderer";
import {IRender, Vec2, Iimage} from 'i-render'
import { GE } from "../../../core/implement/GE";


export class Renderer extends AbstractSystem {

    private irender: IRender

    private loadedSourceRecord = new Map<string, Promise<number>>()


    protected pixiSourceId: number

    constructor(world:GE, config: RendererCfg) {
        super(world, config);
        this.irender = new IRender(config.canvas, { maxNumber:  config.maxSize, autoUpdate:false })
        this.loadAPixi()
    }

    protected loadAPixi(){
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0,0, 1,1)
      this.pixiSourceId = this.irender.loadImg(canvas)
      canvas.width = 0
      canvas.height = 0
    }

    craeteSpirit(sourceId: number, {position, ...rest}: SpiritAttr ): Iimage {
      const spirit =  this.irender.createElement({
        imgId: sourceId,
        position,
      })
      this.updateS(spirit, rest)
      return spirit
    }

    beforeUpdate = () => {
      this.irender.updateImidiatly()
    }


    destroySpirit(spirit: Iimage) {
      this.irender.destoryElement(spirit)
      // FIXME handle clean source.
    }

    

    protected updateS(spirite: Iimage, {position, rotation, scale, sourceId}: SpiritAttr) {
      if(position) spirite.setPosition(position.x, position.y)
      if(sourceId !== undefined ) spirite.setImgId(sourceId)
      if(rotation !== undefined) spirite.setRotation(rotation)
      if(scale) spirite.setScale(scale.x, scale.y)
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