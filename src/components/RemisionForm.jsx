const CAMPOS = [
  { id: 'numeroRemision', label: 'N° Remisión', type: 'text', placeholder: '001', inputMode: 'text' },
  { id: 'fecha', label: 'Fecha', type: 'date' },
  { id: 'destino', label: 'Destino', type: 'text', placeholder: 'Ej: Planta Norte' },
  { id: 'claseMaterial', label: 'Clase de Material', type: 'text', placeholder: 'Ej: Piedra caliza triturada' },
  { id: 'pesoToneladas', label: 'Peso (Toneladas)', type: 'number', placeholder: '0.00', step: '0.01', inputMode: 'decimal' },
  { id: 'placaVolqueta', label: 'Placa Volqueta', type: 'text', placeholder: 'Ej: ABC-123', autoCapitalize: 'characters' },
  { id: 'nombreConductor', label: 'Nombre del Conductor', type: 'text', placeholder: 'Nombre completo', autoCapitalize: 'words' },
  { id: 'firmaBeneficiario', label: 'Beneficiario / Recibe', type: 'text', placeholder: 'Quien recibe el material', autoCapitalize: 'words' },
  { id: 'firmaDespachador', label: 'Despachador', type: 'text', placeholder: 'Quien despacha', autoCapitalize: 'words' },
]

export default function RemisionForm({ formData, setFormData, emptyForm, onPreview }) {
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleReset = () => setFormData(emptyForm)

  return (
    <div className="form-card">
      <h2>Datos de la Remisión</h2>
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

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={handleReset}>
          Limpiar
        </button>
        {/* Only shown on mobile to switch to preview tab */}
        <button className="btn btn-preview-mobile" onClick={onPreview}>
          Ver Remisión →
        </button>
      </div>
    </div>
  )
}
