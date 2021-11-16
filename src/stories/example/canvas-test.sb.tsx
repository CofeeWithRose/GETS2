import { useEffect, useRef, useState } from "react"

export default {
    title: 'Canvas2d Text',
    component: Canvas2dText,
}


export function Canvas2dText() {

    const canvasRef = useRef<(HTMLCanvasElement|null)[]>([])
    const text = '杀害'
    const fontSize = 12;
    const fontFamily = 'auto'
    const lineHeight = '2'
    // fantasy
    // auto
    const font = `bold ${Math.max(fontSize, 12)}px/${lineHeight} ${fontFamily}`
    const positioon = {x: 0, y: 50}
    const canvasSize= {width: 500, height: 500}
    const canvasStyleSize = { width: canvasSize.width/devicePixelRatio , height: canvasSize.height/devicePixelRatio }
    useEffect(() => {
        const canvasList = canvasRef.current
        canvasList.forEach(canvas => {
            if(!canvas) return
            const ctx = canvas.getContext('2d')
            if(!ctx) return
            ctx.scale(devicePixelRatio, devicePixelRatio)
            ctx.font = font;
            ctx.textAlign = 'left';
            ctx.fillStyle = 'blue'
            const textMetrics = ctx.measureText(text)
            const {
                fontBoundingBoxAscent, fontBoundingBoxDescent, 
                actualBoundingBoxAscent, actualBoundingBoxDescent,
                width
            } = textMetrics

            const boundaryHeight = fontBoundingBoxDescent + fontBoundingBoxAscent
            const realLineHeight = lineHeight.includes('px')? parseInt(lineHeight) : fontSize *  parseInt(lineHeight)
            const offsetY = (realLineHeight - boundaryHeight) * 0.5

            ctx.fillStyle = 'blue'
            ctx.fillText( text, positioon.x, (positioon.y + fontBoundingBoxAscent + offsetY))

            ctx.fillText( text, positioon.x, (
                positioon.y + fontBoundingBoxAscent + offsetY + 
                boundaryHeight + 2*offsetY
            ))

            ctx.fillText( text, positioon.x, (
                positioon.y + fontBoundingBoxAscent + offsetY + 
                boundaryHeight + 2*offsetY +
                boundaryHeight +  2*offsetY
            ))
        })
       


    }, [])
   
    return <>
    
    sharp compare
    <div style={{ display: 'flex'}}>
        <span style={{ 
                font, 
                background: 'lightblue',
                color: 'blue',
            }} >
                {text}
        </span>
        <canvas 
            {...canvasSize}
            style={{backgroundColor: 'lightblue', ...canvasStyleSize}}
            ref={canvas => canvasRef.current[0] = canvas}
        />
    </div>


    position match
    <div style={{ position: 'relative'}}>
        <canvas 
            {...canvasSize}
            style={{backgroundColor: 'lightblue', ...canvasStyleSize}}
            ref={canvas => canvasRef.current[1] = canvas}
        />
        <span style={{ 
            font, 
            position: 'absolute', 
            top: positioon.y, 
            left: positioon.x,
            background: 'gray',
            opacity: 0.5,
            color: 'lightblue',
        }} >
             {text}
                <br/>
            {text}
            <br/>
            {text}
        </span>

    </div>
</>
}