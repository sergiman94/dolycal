import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''
const SHEET_ID = '11viVDp1wJyCD2k4IVkNlG-zCQjR3fP4FkcCxEIH5VXk'

export default function RemisionPreview({ formData }) {
  const previewRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const fmt = (val) => val || '—'
  const fmtFecha = (iso) => {
    if (!iso) return '—'
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  const handleExportImage = async () => {
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true })
    const link = document.createElement('a')
    link.download = `remision-${formData.numeroRemision || 'sin-numero'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleExportPDF = async () => {
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' })
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = (canvas.height * pdfW) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
    pdf.save(`remision-${formData.numeroRemision || 'sin-numero'}.pdf`)
  }

  const handleSaveSheet = async () => {
    if (!APPS_SCRIPT_URL) {
      setMsg('⚠️ Configura VITE_APPS_SCRIPT_URL en el archivo .env')
      return
    }
    setSaving(true)
    setMsg('')
    try {
      const payload = {
        sheetId: SHEET_ID,
        fecha: formData.fecha,
        row: [
          formData.numeroRemision,
          formData.fecha,
          formData.destino,
          formData.claseMaterial,
          formData.pesoToneladas,
          formData.placaVolqueta,
          formData.nombreConductor,
          formData.firmaBeneficiario,
          formData.firmaDespachador,
        ],
      }
      const res = await fetch(APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) })
      const json = await res.json()
      if (json.status === 'ok') {
        setMsg('✅ Guardado en Google Sheets correctamente.')
      } else {
        setMsg(`❌ Error: ${json.message || 'respuesta inesperada'}`)
      }
    } catch (err) {
      setMsg(`❌ Error de red: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="preview-column">
      {/* ── Ticket ── */}
      <div ref={previewRef} className="remision-ticket">
        <div className="ticket-header">
          <div className="ticket-title">REMISIÓN DE MATERIAL</div>
          <div className="ticket-subtitle">Mina de Piedra Caliza</div>
        </div>

        <div className="ticket-row ticket-row--highlight">
          <span className="ticket-label">N° Remisión</span>
          <span className="ticket-value ticket-value--big">{fmt(formData.numeroRemision)}</span>
        </div>

        <div className="ticket-row">
          <span className="ticket-label">Fecha</span>
          <span className="ticket-value">{fmtFecha(formData.fecha)}</span>
        </div>

        <div className="ticket-divider" />

        <div className="ticket-row">
          <span className="ticket-label">Destino</span>
          <span className="ticket-value">{fmt(formData.destino)}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-label">Clase de Material</span>
          <span className="ticket-value">{fmt(formData.claseMaterial)}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-label">Peso (Ton)</span>
          <span className="ticket-value">{fmt(formData.pesoToneladas)}</span>
        </div>

        <div className="ticket-divider" />

        <div className="ticket-row">
          <span className="ticket-label">Placa Volqueta</span>
          <span className="ticket-value">{fmt(formData.placaVolqueta)}</span>
        </div>
        <div className="ticket-row">
          <span className="ticket-label">Conductor</span>
          <span className="ticket-value">{fmt(formData.nombreConductor)}</span>
        </div>

        <div className="ticket-divider" />

        <div className="ticket-signatures">
          <div className="ticket-sig-box">
            <div className="ticket-sig-name">{fmt(formData.firmaBeneficiario)}</div>
            <div className="ticket-sig-line" />
            <div className="ticket-sig-label">Beneficiario / Recibe</div>
          </div>
          <div className="ticket-sig-box">
            <div className="ticket-sig-name">{fmt(formData.firmaDespachador)}</div>
            <div className="ticket-sig-line" />
            <div className="ticket-sig-label">Despachador</div>
          </div>
        </div>
      </div>

      {/* ── Action buttons — sticky on mobile ── */}
      <div className="action-buttons">
        <button className="btn btn-export" onClick={handleExportImage}>
          Imagen
        </button>
        <button className="btn btn-export" onClick={handleExportPDF}>
          PDF
        </button>
        <button className="btn btn-save" onClick={handleSaveSheet} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar en Sheets'}
        </button>
      </div>

      {msg && <p className={`save-msg ${msg.startsWith('✅') ? 'ok' : 'err'}`}>{msg}</p>}
    </div>
  )
}
