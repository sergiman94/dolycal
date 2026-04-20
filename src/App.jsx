import { useState } from 'react'
import RemisionForm from './components/RemisionForm'
import RemisionPreview from './components/RemisionPreview'
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

  return (
    <div className="app-container">
      <h1 className="app-title">Remisiones</h1>

      {/* Tab bar — only visible on mobile */}
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
          <RemisionForm formData={formData} setFormData={setFormData} emptyForm={EMPTY_FORM} onPreview={() => setActiveTab('preview')} />
        </div>
        <div className={`layout__pane ${activeTab === 'preview' ? 'layout__pane--active' : ''}`} data-pane="preview">
          <RemisionPreview formData={formData} />
        </div>
      </div>
    </div>
  )
}
