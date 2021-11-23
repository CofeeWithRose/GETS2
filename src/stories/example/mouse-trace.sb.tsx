import { useEffect, useRef, useState } from "react"

export default {
    title: 'mouse-trace',
    component: MouseTrace,
}

export class Circle {
    public x:number
    public y: number
    public r: number
    public speed: number
    public target: Circle|null

    public edgPoint1 = {x: 0, y: 0}
    public edglePoint2 = { x: 0, y: 0}

    protected deltaX = 0
    protected deltaY = 0
    protected dist = 0

    protected lastX = 0
    protected lastY = 0
    constructor(
        x:number,
        y: number,
        r: number,
        speed: number,
        target: Circle|null,
    ){
        this.x = x
        this.y = y
        this.r = r
        this.speed = speed
        this.target = target
    }

   move(){
       if(!this.target) return
       this.deltaX = this.target.x - this.x;
       this.deltaY = this.target.y - this.y;
       
       this.dist = Math.sqrt(this.deltaX **2 + this.deltaY ** 2)
       if(!this.dist) return
       const vX = this.speed * this.deltaX/this.dist;
       const vY = this.speed * this.deltaY/this.dist;
       this.lastX = this.x
       this.lastY = this.y
       if (this.dist < this.speed) {
           this.x = this.target.x
          this.y = this.target.y
       } else {
        this.x += vX;
        this.y += vY
       }
      
   }

    updateEdge() {
        const deltaX = this.x - this.lastX
        const deltaY = this.y - this.lastY
        const dist = Math.sqrt(deltaX **2 + deltaY ** 2)
        
        if(!dist) {
            this.edgPoint1.x = this.x
            this.edgPoint1.y = this.y
            this.edglePoint2.x = this.x
            this.edglePoint2.y = this.y
            return
        }  
        const normalizedDeltaX = 1/dist * deltaX
        const normalizedDeltaY = 1/dist * deltaY
        this.edgPoint1.x = this.x + normalizedDeltaX * this.r
        this.edgPoint1.y = this.y - normalizedDeltaY * this.r
        this.edglePoint2.x = this.x - normalizedDeltaX * this.r,
        this.edglePoint2.y = this.y + normalizedDeltaY * this.r
   }

//    <!--   <linearGradient gradientUnits="userSpaceOnUse" x1="55.6328125" y1="145.77734375" x2="156.21875" y2="190.6796875" id="50673">
//     <stop offset="0%" stop-color="#FF273D" stop-opacity="0"></stop>
//     <stop offset="100%" stop-color="#FF273D" stop-opacity="1"></stop>
//   </linearGradient>
//   <path fill="url(#50673)" stroke-linecap="butt" stroke-linejoin="butt" stroke-miterlimit="0" d="M 55.6328125 145.77734375 L 154.18057500085564 195.2454122697231 158.25692499914436 186.1139627302769 55.6328125 145.77734375 Z"></path>
//   <circle cx="156.21875" cy="190.6796875" r="5" fill="#FF273D" stroke-width="0"></circle> -->

   render() {
       if(!this.target) return ` <circle cx="${this.x}" cy="${this.y}" r="${this.r}" fill="#FF273D" stroke-width="0"></circle>`
     
    //    <linearGradient gradientUnits="userSpaceOnUse" x1="${this.x}" y1="${this.y}" x2="${this.target.x}" y2="${this.target.y}" id="50673">
    //    <stop offset="0%" stop-color="#FF273D" stop-opacity="0"></stop>
    //    <stop offset="100%" stop-color="#FF273D" stop-opacity="1"></stop>
    //    </linearGradient>
       const path =this.target? `
       <path fill="red" stroke-linecap="butt" stroke-linejoin="butt" stroke-miterlimit="0" 
       d="M ${this.edgPoint1.x} ${this.edgPoint1.y} 
       ${this.edglePoint2.x} ${this.edglePoint2.y} 
       L ${this.target.edglePoint2.x} ${this.target.edglePoint2.y}
       ${this.target.edgPoint1.x} ${this.target.edgPoint1.y} 
       Z"></path>
       ` : ''
    return `${path} <circle cx="${this.x}" cy="${this.y}" r="${this.r}" fill="#FF273D" stroke-width="0"></circle>`
   }

}

export function MouseTrace() {

    const pointsRef= useRef<Circle[]>([])
    const svgRef = useRef<SVGAElement|undefined>()
    useEffect(() => {
        let target:Circle|null = null
        for(let i=0; i< 10; i++) {
         target = new Circle(0, 0, 10 - i * 0.5, 200/(i+1), target)
         pointsRef.current.push(target)
        }
        const onMouseMove = (e: MouseEvent) => {
            pointsRef.current[0].x = e.clientX;
            pointsRef.current[0].y = e.clientY
        }
        window.addEventListener('mousemove', onMouseMove)
        return () => window.removeEventListener('mousemove', onMouseMove)
    }, [])

    useEffect(() => {
        let curRaf = 0
        const onUpdate = () => {
            const svg = svgRef.current
            if(!svg) return
            let svgStr = ''
            pointsRef.current.forEach( circle => {
                circle.move()
                circle.updateEdge()
                svgStr += circle.render()
            })
            svg.innerHTML = svgStr
            curRaf = window.requestAnimationFrame(onUpdate)
        }
        onUpdate()
       return () => window.cancelAnimationFrame(curRaf)
    }, [])

    return <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg" 
        version="1.1" 
        fillRule="evenodd" 
        fill="none" 
        stroke="none" 
        strokeLinecap="square" 
        strokeMiterlimit="10" 
        overflow="hidden" 
        preserveAspectRatio="none" 
        pointerEvents="none" 
        width="692px" 
        height="1080px" 
        viewBox="0 0 692 1080" 
        style={{lineHeight: 'normal'}} 
     > 
       
    </svg>
}