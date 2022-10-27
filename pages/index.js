import React, { useRef, useState, useEffect } from 'react'
import { HexColorPicker } from "react-colorful"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight, faPencil } from '@fortawesome/free-solid-svg-icons'
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

export default function Home() {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)

    const [data , setData] = useState({
        drawing: false,
        loaded: false,
        color: '#000',
        rotateDegree: 0,
        lineWidth: 10,
        openedPalette: false
    })

    useEffect(() => {
        setData((data) => ({
            ...data,
            loaded: true
        }))

        const canvas = canvasRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`

        const context = canvas.getContext('2d')
        context.lineCap = 'round'
        context.strokeStyle = data.color
        context.lineWidth = data.lineWidth
        contextRef.current = context

        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const onMouseDown = (event) => {
        contextRef.current.beginPath()
        contextRef.current.moveTo(event.clientX || event.touches[0].clientX, event.clientY || event.touches[0].clientY)
        setData((data) => ({
            ...data,
            drawing: true,
            openedPalette: false
        }))
    }

    const onMouseUp = () => {
        contextRef.current.closePath()
        setData((data) => ({
            ...data,
            drawing: false
        }))
    }

    const draw = (event) => {
        if (data.drawing == true) {
            contextRef.current.lineTo(event.clientX || event.touches[0].clientX, event.clientY || event.touches[0].clientY)
            contextRef.current.stroke()
        }
    }

    const onResize = () => {
        canvasRef.current.style.width = `${window.innerWidth}px`
        canvasRef.current.style.height = `${window.innerHeight}px`
    }

    const changeColorHandler = (col) => {
        setData((data) => ({
            ...data,
            color: col
        }))
        contextRef.current.strokeStyle = col
    }

    const resetHandler = () => {
        setData((data) => ({
          ...data,
          rotateDegree: data.rotateDegree + 360,
          openedPalette: false
        }))
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    const colorHandler = () => {
        setData((data) => ({
            ...data,
            openedPalette: !data.openedPalette
        }))
    }

    const handleChange = (newValue) => {
        setData((data) => ({
            ...data,
            lineWidth: newValue.target.value,
            openedPalette: false
        }))
        contextRef.current.lineWidth = newValue.target.value
    }

    return (
        <section id="canvas_wrap">
            <canvas
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={draw}
                onTouchStart={onMouseDown}
                onTouchEnd={onMouseUp}
                onTouchMove={draw}
                ref={canvasRef}
            />
            <div className={'controls ' + (data.loaded == true ? 'loaded' : '')}>
                <div className="thickness">
                    <Slider 
                        value={data.lineWidth} 
                        onChange={handleChange} 
                        valueLabelDisplay="auto"
                        sx={{color: data.color}}
                        step={1}
                        min={1}
                        max={100}
                    />
                </div>
                <div className={'color ' + (data.openedPalette == true ? 'opened' : '')}>
                    <span className="current_color" style={{backgroundColor: data.color}} onClick={colorHandler}></span>
                    <HexColorPicker color={data.color} onChange={changeColorHandler} />
                </div>
                <div className="reset faicon" onClick={resetHandler} style={{transform: 'rotate('+ data.rotateDegree +'deg)'}}>
                    <FontAwesomeIcon icon={faRotateRight} color={data.color} />
                </div>
            </div> 
        </section>
    )
}
