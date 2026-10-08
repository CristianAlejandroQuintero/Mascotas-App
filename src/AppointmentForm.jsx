import { useState } from 'react'
import './AppointmentForm.css'
import { useCitas } from './CitasContext.jsx'

const appointmentConfigByService = {
  veterinaria: {
    subjectLabel: 'Motivo de la cita',
    options: ['Consulta general', 'Vacunación', 'Control preventivo'],
  },
  estetica: {
    subjectLabel: 'Servicio de estética',
    options: ['Baño y secado', 'Corte de pelo', 'Baño y corte'],
  },
  entrenamiento: {
    subjectLabel: 'Tipo de sesión',
    options: ['Programa de adiestramiento', 'Sesión de obediencia', 'Sesión de relajación'],
  },
  funerarios: {
    subjectLabel: 'Tipo de acompañamiento',
    options: ['Protocolo de despedida', 'Orientación sobre cremación', 'Orientación sobre entierro'],
  },
  marketing: {
    subjectLabel: 'Tema de la cita',
    options: ['Campaña digital', 'Fidelización de clientes', 'Consulta de marketing'],
  },
}

function getLocalDateValue(date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function AppointmentForm({
  serviceType,
  serviceName,
  clientLabel = 'Nombre de quien agenda',
  clientPlaceholder = 'Tu nombre',
  entityLabel = 'Nombre de la mascota',
  entityPlaceholder = 'Nombre de tu mascota',
}) {
  const { agregarCita } = useCitas()
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const appointmentConfig = appointmentConfigByService[serviceType]
  if (!appointmentConfig) {
    throw new Error(`No hay opciones de agendamiento para el servicio "${serviceType}".`)
  }

  const { options, subjectLabel } = appointmentConfig

  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const appointment = {
      correo: formData.get('email').toString().trim(),
      nombreMascota: formData.get('entityName').toString().trim(),
      tipoCita: serviceName,
      fecha: formData.get('date').toString(),
      hora: formData.get('time').toString(),
      detalles: [
        formData.get('appointmentType').toString(),
        formData.get('details').toString().trim(),
      ].filter(Boolean).join(' — '),
      estado: 'pendiente',
    }

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const savedAppointment = await agregarCita(appointment)
      form.reset()
      window.alert(
        `Cita guardada en citas.json correctamente.\n\n${JSON.stringify(savedAppointment, null, 2)}`,
      )
    } catch (error) {
      console.error('No se pudo completar el agendamiento.', error)
      setSubmitError(error.message || 'No se pudo guardar la cita. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="appointment-section" aria-labelledby="appointment-title">
      <div className="appointment-heading">
        <span className="eyebrow">Coordinemos su atención</span>
        <h2 id="appointment-title">Agenda {serviceName.toLowerCase()}</h2>
        <p>Completa tus datos y cuéntanos qué servicio necesitas. La fecha y hora son preferencias para coordinar la cita.</p>
      </div>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <label htmlFor="appointment-client">{clientLabel}</label>
        <input
          id="appointment-client"
          name="clientName"
          type="text"
          autoComplete="name"
          placeholder={clientPlaceholder}
          required
        />
        <label htmlFor="appointment-entity">{entityLabel}</label>
        <input
          id="appointment-entity"
          name="entityName"
          type="text"
          placeholder={entityPlaceholder}
          required
        />

        <div className="appointment-fields">
          <div className="appointment-field">
            <label htmlFor="appointment-email">Correo electrónico</label>
            <input
              id="appointment-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="appointment-field">
            <label htmlFor="appointment-phone">Teléfono (opcional)</label>
            <input
              id="appointment-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Tu teléfono"
            />
          </div>
        </div>

        <label htmlFor="appointment-type">{subjectLabel}</label>
        <select id="appointment-type" name="appointmentType" required defaultValue="">
          <option value="" disabled>Selecciona una opción</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <div className="appointment-fields">
          <div className="appointment-field">
            <label htmlFor="appointment-date">Fecha preferida</label>
            <input
              id="appointment-date"
              name="date"
              type="date"
              min={getLocalDateValue(new Date())}
              required
            />
          </div>
          <div className="appointment-field">
            <label htmlFor="appointment-time">Hora preferida (opcional)</label>
            <input id="appointment-time" name="time" type="time" />
          </div>
        </div>

        <label htmlFor="appointment-details">Detalles adicionales (opcional)</label>
        <textarea
          id="appointment-details"
          name="details"
          rows="4"
          placeholder="Cuéntanos algo que debamos tener en cuenta."
        />

        {submitError && <p className="appointment-error" role="alert">{submitError}</p>}
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Solicitar cita'} <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  )
}

export default AppointmentForm
