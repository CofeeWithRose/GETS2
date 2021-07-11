import { AbstractMnager } from "../../../core/implement/AbstractManager";
import { RendererCfg, RendererInfer, SpiritAttr } from "../infer/Renderer";
import {IRender, Vec2, Iimage} from 'i-render'
import { GE } from "../../../core/implement/GE";


export class Renderer extends AbstractMnager {

    private irender: IRender

    private loadedSourceRecord = new Map<string, Promise<number>>()

    private spiriteMap = new Map<string, Iimage>()


    private spiriteId = 0

    protected pixiSourceId: number

    constructor(game:GE, config: RendererCfg) {
        super(game, config);
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

    craeteSpirit(sourceId: number, {position, ...rest}: SpiritAttr ): string {
      const spirit =  this.irender.createElement({
        imgId: sourceId,
        position,
      })
      this.updateS(spirit, rest)
      const id = `spirit_${++this.spiriteId}`
      this.spiriteMap.set(id, spirit)
      return id
    }

    beforeUpdate = () => {
      this.irender.updateImidiatly()
    }

    // createReact({x, y}: Vec2, {position, scale, ...rest}: SpiritAttr): string {
    //   const spirit = this.irender.createElement({
    //     imgId: this.pixiSourceId,
    //     position,
    //   })
    //   const id = `spirit_${++this.spiriteId}`
    //   this.spiriteMap.set(id, spirit)
    //   spirit.setScale(x * scale.x, y * scale.y)
    //   this.updateS(spirit, rest)
    //   return id
    // }

    // updateRect(spiriteId: string): void{

    // }

    getSize(spiritId: string): Vec2{
      const spirit = this.spiriteMap.get(spiritId)
      return spirit.size
    }

    destroySpirit(spiritId: string) {
      const spirit = this.spiriteMap.get(spiritId)
      this.spiriteMap.delete(spiritId)
      this.irender.destoryElement(spirit)
      // TODO handle clean source.
    }

    // updateSpirit(spiriteId: string, attr: SpiritAttr ){
    //   const spirite = this.spiriteMap.get(spiriteId)
    //   if(spirite) this.updateS(spirite, attr)
    // }

    updatePosition(spiriteId: string, x: number, y: number){
      const spirite = this.spiriteMap.get(spiriteId)
      spirite.setPosition(x, y)
    }

    updateSourceId(spiriteId: string, sourceId: number){
      const spirite = this.spiriteMap.get(spiriteId)
      spirite.setImgId(sourceId)
    }

    updateScale(spiriteId: string, scale: Vec2){
      const spirite = this.spiriteMap.get(spiriteId)
      spirite.setScale(scale.x, scale.y)
    }

    updateRotation(spiriteId: string, rotation: number){
      const spirite = this.spiriteMap.get(spiriteId)
      spirite.setRotation(rotation)
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