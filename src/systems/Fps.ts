import { AbstractSystem } from "../core/implement/AbstractSystem";
import { TimerSystem } from "./timer/implement/TimerSystem";

export class Fps extends AbstractSystem {


    protected timer: TimerSystem

    protected container: HTMLElement = document.createElement('div')

    init = () => {
        this.timer = this.getSystem(TimerSystem)
        this.container.style.width = '200px'
        this.container.style.height = '40px'
        this.container.style.background = 'black'
        this.container.style.color = 'white'
        this.container.style.opacity = '0.5'
        this.container.style.position = 'fixed'
        this.container.style.left = '0'
        this.container.style.top = '0'
        document.body.appendChild(this.container)
    }

    protected lastFrameCount = 0

    protected lastTime = 0

    update = () => {
        
        if(this.timer.FrameCount%100 ===0) {
            const fromNow = this.timer.StartFromNow
            const framCount = this.timer.FrameCount
            const fps = (framCount - this.lastFrameCount)/(this.timer.StartFromNow - this.lastTime)
            this.lastTime = fromNow
            this.lastFrameCount = framCount
            this.container.innerHTML = `FPS: ${fps.toFixed(0)}`
        }

    }

    destroy() {
        document.body.removeChild(this.container)
    }
}