import { useEffect, useState } from 'react'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export default function HistorialModal({ onClose }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!APPS_SCRIPT_URL) {
      setError('Configura VITE_APPS_SCRIPT_URL para ver el historial.')
      setLoading(false)
      return
    }
    fetch(`${APPS_SCRIPT_URL}?action=history&fecha=${today}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 'ok') setRows(d.rows)
        else setError(d.message || 'Error al cargar historial')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [today])

  const fmtFecha = (val) => {
    if (!val) return '—'
    const s = String(val)
    if (s.includes('-')) {
      const [y, m, d] = s.split('-')
      return `${d}/${m}/${y}`
    }
    return s
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Historial — {fmtFecha(today)}</span>
          <button className="sigpad-close" onClick={onClose}>✕</button>
        </div>

        {loading && <p className="modal-status">Cargando…</p>}
        {error   && <p className="modal-status modal-status--err">{error}</p>}

        {!loading && !error && rows.length === 0 && (
          <p className="modal-status">No hay remisiones registradas hoy.</p>
        )}

        {!loading && rows.length > 0 && (
          <div className="timeline">
            {rows.map((r, i) => (
              <div className="tl-item" key={i}>
                <div className="tl-dot" />
                {i < rows.length - 1 && <div className="tl-line" />}
                <div className="tl-card">
                  <div className="tl-card-top">
                    <span className="tl-num">#{r.numeroRemision}</span>
                    <span className="badge-despachado">DESPACHADO</span>
                  </div>
                  <div className="tl-row"><span>Destino</span><span>{r.destino || '—'}</span></div>
                  <div className="tl-row"><span>Material</span><span>{r.claseMaterial || '—'}</span></div>
                  <div className="tl-row"><span>Peso</span><span>{r.pesoToneladas ? `${r.pesoToneladas} Ton` : '—'}</span></div>
                  <div className="tl-row"><span>Placa</span><span>{r.placaVolqueta || '—'}</span></div>
                  <div className="tl-row"><span>Conductor</span><span>{r.nombreConductor || '—'}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
