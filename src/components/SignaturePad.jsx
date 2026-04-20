import { useRef, useEffect, useState } from 'react'

export default function SignaturePad({ onSave, onClose }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  const startDraw = (e) => {
    e.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsEmpty(false)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endDraw = (e) => {
    e.preventDefault()
    drawing.current = false
  }

  const clear = () => {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }

  const save = () => {
    onSave(canvasRef.current.toDataURL('image/png'))
    onClose()
  }

  return (
    <div className="sigpad-overlay" onClick={onClose}>
      <div className="sigpad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sigpad-header">
          <span>Firma del Despachador</span>
          <button className="sigpad-close" onClick={onClose}>✕</button>
        </div>
        <canvas
          ref={canvasRef}
          width={320}
          height={160}
          className="sigpad-canvas"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <div className="sigpad-actions">
          <button className="btn btn-secondary" onClick={clear}>Borrar</button>
          <button className="btn btn-save" disabled={isEmpty} onClick={save}>Aceptar</button>
        </div>
      </div>
    </div>
  )
}
