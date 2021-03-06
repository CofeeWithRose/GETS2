import { AbstractMnager } from "../core/implement/AbstractManager";
import { TimerManager } from "./timer/implement/TimerManager";

export class Fps extends AbstractMnager {


    protected timer: TimerManager

    protected container: HTMLElement = document.createElement('div')

    init = () => {
        this.timer = this.getManager(TimerManager)
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

    update = () => {
        if(this.timer.FrameCount%100 ===0) {
            const fps = this.timer.FrameCount/this.timer.StartFromNow
            this.container.innerHTML = `FPS: ${fps.toFixed(0)}`
        }
       

    }
}