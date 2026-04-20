import { useState } from 'react'
import RemisionForm from './components/RemisionForm'
import RemisionPreview from './components/RemisionPreview'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
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

  return (
    <div className="app-container">
      <h1 className="app-title">Remisiones — Mina de Piedra Caliza</h1>
      <div className="layout">
        <RemisionForm formData={formData} setFormData={setFormData} />
        <RemisionPreview formData={formData} />
      </div>
    </div>
  )
}

export default App
