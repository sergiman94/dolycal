import { useEffect, useState } from 'react'
import SignaturePad from './SignaturePad'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

const CAMPOS = [
  { id: 'fecha',           label: 'Fecha',              type: 'date' },
  { id: 'destino',         label: 'Destino',            type: 'text', placeholder: 'Ej: Planta Norte' },
  { id: 'claseMaterial',   label: 'Clase de Material',  type: 'text', placeholder: 'Ej: Piedra caliza triturada' },
  { id: 'pesoToneladas',   label: 'Peso (Toneladas)',   type: 'number', placeholder: '0.00', step: '0.01', inputMode: 'decimal' },
  { id: 'placaVolqueta',   label: 'Placa Volqueta',     type: 'text', placeholder: 'Ej: ABC-123', autoCapitalize: 'characters' },
  { id: 'nombreConductor', label: 'Nombre del Conductor', type: 'text', placeholder: 'Nombre completo', autoCapitalize: 'words' },
  { id: 'firmaBeneficiario', label: 'Beneficiario / Recibe', type: 'text', placeholder: 'Quien recibe el material', autoCapitalize: 'words' },
]

export default function RemisionForm({ formData, setFormData, emptyForm, onPreview }) {
  const [loadingNum, setLoadingNum] = useState(true)
  const [showSigPad, setShowSigPad] = useState(false)

  // ── Auto-número: lee el último desde Sheets y suma 1 ────────────────────
  useEffect(() => {
    if (!APPS_SCRIPT_URL) { setLoadingNum(false); return }
    fetch(`${APPS_SCRIPT_URL}?action=lastNumber`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 'ok') {
          const next = String((d.lastNumber || 0) + 1).padStart(3, '0')
          setFormData((prev) => ({ ...prev, numeroRemision: next }))
        }
      })
      .catch(() => {})
      .finally(() => setLoadingNum(false))
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleReset = () => setFormData(emptyForm)

  const handleSignature = (dataUrl) => {
    setFormData((prev) => ({ ...prev, firmaDespachador: dataUrl }))
  }

  const hasFirma = formData.firmaDespachador && formData.firmaDespachador.startsWith('data:image')

  return (
    <div className="form-card">
      <h2>Datos de la Remisión</h2>

      {/* N° Remisión — solo lectura */}
      <div className="field">
        <label>N° Remisión</label>
        <div className="field-readonly">
          {loadingNum ? <span className="field-loading">Cargando…</span> : (
            <span className="field-num">{formData.numeroRemision || '—'}</span>
          )}
          <span className="field-readonly-badge">Auto</span>
        </div>
      </div>

      {CAMPOS.map(({ id, label, type, placeholder, step, inputMode, autoCapitalize }) => (
        <div className="field" key={id}>
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            step={step}
            inputMode={inputMode}
            autoCapitalize={autoCapitalize}
            value={formData[id]}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* Nombre del despachador */}
      <div className="field">
        <label htmlFor="nombreDespachador">Nombre del Despachador</label>
        <input
          id="nombreDespachador"
          type="text"
          placeholder="Nombre completo"
          autoCapitalize="words"
          value={formData.nombreDespachador}
          onChange={handleChange}
        />
      </div>

      {/* Firma del despachador */}
      <div className="field">
        <label>Firma del Despachador</label>
        {hasFirma ? (
          <div className="firma-preview-wrap">
            <img src={formData.firmaDespachador} alt="firma" className="firma-preview-img" />
            <div className="firma-actions">
              <span className="badge-despachado">DESPACHADO</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSigPad(true)}>
                Refirmar
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-firma" onClick={() => setShowSigPad(true)}>
            ✍ Agregar Firma
          </button>
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={handleReset}>Limpiar</button>
        <button className="btn btn-preview-mobile" onClick={onPreview}>Ver Remisión →</button>
      </div>

      {showSigPad && (
        <SignaturePad onSave={handleSignature} onClose={() => setShowSigPad(false)} />
      )}
    </div>
  )
}
