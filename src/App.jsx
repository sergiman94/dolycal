import { useState } from 'react'
import RemisionForm from './components/RemisionForm'
import RemisionPreview from './components/RemisionPreview'
import HistorialModal from './components/HistorialModal'
import './App.css'

const EMPTY_FORM = {
  numeroRemision: '',
  fecha: new Date().toISOString().split('T')[0],
  destino: '',
  claseMaterial: '',
  pesoToneladas: '',
  placaVolqueta: '',
  nombreConductor: '',
  firmaBeneficiario: '',
  firmaDespachador: '',
}

export default function App() {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState('form')
  const [showHistorial, setShowHistorial] = useState(false)

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">Remisiones</h1>
        <button className="btn-historial" onClick={() => setShowHistorial(true)}>
          📋 Historial
        </button>
      </div>

      {/* Tab bar — mobile only */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'form' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Formulario
        </button>
        <button
          className={`tab-btn ${activeTab === 'preview' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Vista Previa
        </button>
      </div>

      <div className="layout">
        <div className={`layout__pane ${activeTab === 'form' ? 'layout__pane--active' : ''}`} data-pane="form">
          <RemisionForm
            formData={formData}
            setFormData={setFormData}
            emptyForm={EMPTY_FORM}
            onPreview={() => setActiveTab('preview')}
          />
        </div>
        <div className={`layout__pane ${activeTab === 'preview' ? 'layout__pane--active' : ''}`} data-pane="preview">
          <RemisionPreview formData={formData} />
        </div>
      </div>

      {showHistorial && <HistorialModal onClose={() => setShowHistorial(false)} />}
    </div>
  )
}
