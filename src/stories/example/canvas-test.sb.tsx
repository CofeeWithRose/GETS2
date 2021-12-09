import { useEffect, useRef, useState } from "react"

export default {
    title: 'Canvas2d Text',
    component: Canvas2dText,
}

type FixedTextMetrics = TextMetrics & {fontBoundingBoxAscent: number, fontBoundingBoxDescent: number}

const getTextTexture = ( text: string, font: string, lineHeight: number) => {
    const texture = document.createElement('canvas')
    const ctx = texture.getContext('2d')
    if(!ctx) return
    ctx.font = font; 
    const textMetrics = ctx.measureText(text) as FixedTextMetrics
    const { fontBoundingBoxAscent, fontBoundingBoxDescent, width } = textMetrics
    texture.height = lineHeight
    texture.width = width

    const fontHeight = fontBoundingBoxAscent + fontBoundingBoxDescent
    const lineHeighOffset = (lineHeight - fontHeight) * 0.5
    ctx.font = font; 
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text, 0, fontBoundingBoxAscent + lineHeighOffset)
    return texture
}

export function Canvas2dText() {

    const canvasRef = useRef<(HTMLCanvasElement|null)[]>([])
    const text = '杀害'
    const fontSize = 28;
    const fontFamily = 'Arial'
    const lineHeightStr = '2'
    const lineHeight = lineHeightStr.includes('px')? parseInt(lineHeightStr) : fontSize *  parseInt(lineHeightStr)
    const font = `bold ${Math.max(fontSize, 12)}px/${lineHeight}px ${fontFamily}`
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
            const texture = getTextTexture(text, font, lineHeight)
            console.log(texture.height, texture.width);
            
            ctx.drawImage(texture, positioon.x, positioon.y)
            // ctx.font = font;
            // ctx.textAlign = 'left';
            // ctx.textBaseline = 'middle'
            // ctx.fillStyle = 'blue'
            // const textMetrics = ctx.measureText(text)
          
            // const {
            //     fontBoundingBoxAscent, fontBoundingBoxDescent, 
            //     actualBoundingBoxAscent, actualBoundingBoxDescent,
            //     width
            // } = textMetrics

            
            // const boundaryHeight = fontBoundingBoxDescent + fontBoundingBoxAscent
            // const offsetY = (lineHeight - boundaryHeight) * 0.5
            // console.log('fontBoundingBoxAscent, actualBoundingBoxAscent', fontBoundingBoxAscent, actualBoundingBoxAscent);

            // const first = positioon.y + fontBoundingBoxAscent + offsetY
            // ctx.fillStyle = 'blue'
            // ctx.fillText( text, positioon.x, first)

            // ctx.fillText( text, positioon.x, (
            //     first + lineHeight
            // ))

            // ctx.fillText( text, positioon.x, (first + lineHeight *2))
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