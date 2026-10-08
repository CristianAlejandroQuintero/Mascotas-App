import { useEffect, useRef, useState } from 'react'
import AppointmentForm from './AppointmentForm.jsx'
import { useCitas } from './CitasContext.jsx'
import './Modal.css'

function Modal({
  onClose,
  serviceType,
  serviceName,
  clientLabel,
  clientPlaceholder,
  entityLabel,
  entityPlaceholder,
  returnFocusRef,
}) {
  const [view, setView] = useState('options')
  const [lookupResults, setLookupResults] = useState(null)
  const [lookupError, setLookupError] = useState('')
  const { citas, storageError } = useCitas()
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const returnFocusElement = returnFocusRef.current
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      returnFocusElement?.focus()
    }
  }, [onClose, returnFocusRef])

  function handleLookup(event) {
    event.preventDefault()
    const email = new FormData(event.currentTarget)
      .get('lookupEmail')
      .toString()
      .trim()
      .toLowerCase()

    const matchingAppointments = citas.filter(
      (appointment) => appointment.correo.trim().toLowerCase() === email,
    )

    setLookupError('')
    setLookupResults(matchingAppointments)
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="service-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        <button
          className="modal-close"
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <span aria-hidden="true">×</span>
        </button>

        {view === 'options' ? (
          <>
            <span className="eyebrow">Mascotas Pro · {serviceName}</span>
            <h2 id="service-modal-title">¿En qué podemos ayudarte?</h2>
            {storageError && (
              <p className="modal-feedback modal-feedback-error" role="alert">
                {storageError}
              </p>
            )}
            <div className="modal-options">
              <form className="modal-option" onSubmit={handleLookup}>
                <h3>Consultar citas</h3>
                <p>Usa tu correo electrónico como identificador.</p>
                <label htmlFor="lookup-email">Correo electrónico</label>
                <input
                  id="lookup-email"
                  name="lookupEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  required
                  onChange={() => {
                    setLookupResults(null)
                    setLookupError('')
                  }}
                />
                <button className="button button-primary" type="submit">
                  Consultar citas
                </button>
                {lookupError && (
                  <p className="modal-feedback modal-feedback-error" role="alert">
                    {lookupError}
                  </p>
                )}
                {lookupResults && lookupResults.length === 0 && (
                  <p className="modal-feedback" role="status">
                    No hay citas registradas con este correo
                  </p>
                )}
                {lookupResults?.length > 0 && (
                  <div className="appointment-results" role="status">
                    <h4>Citas encontradas: {lookupResults.length}</h4>
                    <ul>
                      {lookupResults.map((appointment, index) => (
                        <li key={`${appointment.correo}-${appointment.fecha}-${appointment.hora}-${index}`}>
                          <strong>{appointment.tipoCita}</strong>
                          <dl>
                            <div>
                              <dt>Mascota</dt>
                              <dd>{appointment.nombreMascota}</dd>
                            </div>
                            <div>
                              <dt>Fecha</dt>
                              <dd>{appointment.fecha}</dd>
                            </div>
                            <div>
                              <dt>Hora</dt>
                              <dd>{appointment.hora || 'Por coordinar'}</dd>
                            </div>
                            <div>
                              <dt>Detalles</dt>
                              <dd>{appointment.detalles}</dd>
                            </div>
                            <div>
                              <dt>Estado</dt>
                              <dd>{appointment.estado}</dd>
                            </div>
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>

              <div className="modal-option modal-booking-option">
                <h3>Agendar cita</h3>
                <p>Solicita una cita para el servicio de {serviceName.toLowerCase()}.</p>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => setView('booking')}
                >
                  Agendar cita <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              className="modal-back"
              type="button"
              onClick={() => setView('options')}
            >
              ← Volver a opciones
            </button>
            <h2 id="service-modal-title">Agendar {serviceName.toLowerCase()}</h2>
            <AppointmentForm
              serviceType={serviceType}
              serviceName={serviceName}
              clientLabel={clientLabel}
              clientPlaceholder={clientPlaceholder}
              entityLabel={entityLabel}
              entityPlaceholder={entityPlaceholder}
            />
          </>
        )}
      </section>
    </div>
  )
}

export default Modal
