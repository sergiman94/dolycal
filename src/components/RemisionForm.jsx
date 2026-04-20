const CAMPOS = [
  { id: 'numeroRemision', label: 'N° Remisión', type: 'text', placeholder: '001' },
  { id: 'fecha', label: 'Fecha', type: 'date' },
  { id: 'destino', label: 'Destino', type: 'text', placeholder: 'Ej: Planta Norte' },
  { id: 'claseMaterial', label: 'Clase de Material', type: 'text', placeholder: 'Ej: Piedra caliza triturada' },
  { id: 'pesoToneladas', label: 'Peso (Toneladas)', type: 'number', placeholder: '0.00', step: '0.01' },
  { id: 'placaVolqueta', label: 'Placa Volqueta', type: 'text', placeholder: 'Ej: ABC-123' },
  { id: 'nombreConductor', label: 'Nombre del Conductor', type: 'text', placeholder: 'Nombre completo' },
  { id: 'firmaBeneficiario', label: 'Nombre Beneficiario / Firma', type: 'text', placeholder: 'Quien recibe el material' },
  { id: 'firmaDespachador', label: 'Nombre Despachador / Firma', type: 'text', placeholder: 'Quien despacha' },
]

export default function RemisionForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleReset = () => {
    setFormData({
      numeroRemision: '',
      fecha: new Date().toISOString().split('T')[0],
      destino: '',
      claseMaterial: '',
      pesoToneladas: '',
      placaVolqueta: '',
      nombreConductor: '',
      firmaBeneficiario: '',
      firmaDespachador: '',
    })
  }

  return (
    <div className="form-card">
      <h2>Datos de la Remisión</h2>
      {CAMPOS.map(({ id, label, type, placeholder, step }) => (
        <div className="field" key={id}>
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            step={step}
            value={formData[id]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button className="btn btn-secondary" onClick={handleReset}>
        Limpiar formulario
      </button>
    </div>
  )
}
