import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from './Modal.jsx'

function ServiceDetail({
  icon,
  title,
  intro,
  description,
  highlights,
  serviceType,
  clientLabel,
  clientPlaceholder,
  entityLabel,
  entityPlaceholder,
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const appointmentButtonRef = useRef(null)
  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <section className="service-detail section-wrap" aria-labelledby="service-detail-title">
      <Link className="service-back" to="/#servicios">← Volver a servicios</Link>
      <article className="service-detail-card">
        <div className="service-detail-icon" aria-hidden="true">{icon}</div>
        <span className="eyebrow">Mascotas Pro · Servicios</span>
        <h1 id="service-detail-title">{title}</h1>
        <p className="service-detail-intro">{intro}</p>
        <p className="service-detail-description">{description}</p>
        <h2>¿Qué ofrecemos?</h2>
        <ul>
          {highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
        <button
          className="button button-primary"
          type="button"
          ref={appointmentButtonRef}
          onClick={() => setModalOpen(true)}
        >
          Consultar o agendar <span aria-hidden="true">→</span>
        </button>
      </article>
      {modalOpen && (
        <Modal
          onClose={closeModal}
          serviceType={serviceType}
          serviceName={title}
          clientLabel={clientLabel}
          clientPlaceholder={clientPlaceholder}
          entityLabel={entityLabel}
          entityPlaceholder={entityPlaceholder}
          returnFocusRef={appointmentButtonRef}
        />
      )}
    </section>
  )
}

export default ServiceDetail
