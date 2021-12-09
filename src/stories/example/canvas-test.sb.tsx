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
    const { actualBoundingBoxAscent, fontBoundingBoxAscent, fontBoundingBoxDescent, width } = textMetrics
    console.log(text,actualBoundingBoxAscent, fontBoundingBoxAscent);
    
    texture.height = lineHeight * devicePixelRatio
    texture.width = width * devicePixelRatio

    const fontHeight = fontBoundingBoxAscent + fontBoundingBoxDescent
    const lineHeighOffset = (lineHeight - fontHeight) * 0.5
    ctx.scale(devicePixelRatio, devicePixelRatio)
    ctx.font = font; 
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text, 0, fontBoundingBoxAscent + lineHeighOffset)
    return texture
}

const demo = {
    text: '0x0002',
    positioon: {x: 0, y: 0},
    fontFamily: 'auto',
    lineHeightStr: '2',
    fontSize: 16,
    fontWeight: 'bold',
}
type FontStyle = typeof demo

const getFont = (style: FontStyle) => {
    const {fontFamily, fontWeight, lineHeightStr, fontSize} = style
    const lineHeight = lineHeightStr.includes('px')? parseInt(lineHeightStr) : fontSize *  parseInt(lineHeightStr)
    return {
        font: `${fontWeight} ${Math.max(fontSize, 12)}px/${lineHeight}px ${fontFamily}`,
        lineHeight
    }
}

export function Canvas2dText() {

    const canvasRef = useRef<(HTMLCanvasElement|null)[]>([])
    const canvasSize= {width: 500, height: 500}
    const canvasStyleSize = { width: canvasSize.width/devicePixelRatio , height: canvasSize.height/devicePixelRatio }

    const textInfoList: FontStyle[] = [
        {
            text: 'M',
            positioon: {x: 0, y: 0},
            fontFamily: 'auto',
            lineHeightStr: '2',
            fontSize: 16,
            fontWeight: 'bold',
        },
        {
            text: '~!@#$%&*()_',
            positioon: {x: 0, y: 0},
            fontFamily: 'auto',
            lineHeightStr: '2',
            fontSize: 16,
            fontWeight: 'bold',
        },
        {
            text: 'qwe',
            positioon: {x: 40, y: 0},
            fontFamily: 'fantasy',
            lineHeightStr: '2',
            fontSize: 16,
            fontWeight: 'bold',
        },
        {
            text: 'asd',
            positioon: {x: 80, y: 0},
            fontFamily: 'auto',
            lineHeightStr: '2',
            fontSize: 16,
            fontWeight: 'bold',
        },
    ]

   
    useEffect(() => {
        const canvasList = canvasRef.current
        canvasList.forEach(canvas => {
            if(!canvas) return
            const ctx = canvas.getContext('2d')
            if(!ctx) return
            textInfoList.forEach((fontInfo) => {
                const {positioon, text} = fontInfo
                const {font, lineHeight} = getFont(fontInfo)
                const texture = getTextTexture(text, font, lineHeight)
                ctx.drawImage(texture, positioon.x * devicePixelRatio, positioon.y * devicePixelRatio)
            })
        })
       


    }, [])
   
    return <>
    
    position match
    <div style={{ position: 'relative'}}>
        <canvas 
            {...canvasSize}
            style={{backgroundColor: 'lightblue', ...canvasStyleSize}}
            ref={canvas => canvasRef.current[1] = canvas}
        />

            {
                textInfoList.map( (info) => {
                    const {positioon, text} = info
                    const {font} = getFont(info)
                    return <span style={{ 
                        font, 
                        position: 'absolute', 
                        top: positioon.y, 
                        left: positioon.x,
                        background: 'gray',
                        opacity: 0.5,
                        color: 'lightblue',
                    }} >
                        {text}
                    </span>
                })
            }
        

    </div>
</>
}