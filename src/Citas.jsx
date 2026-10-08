import { useMemo, useState } from 'react'
import citasIniciales from './citas.json'
import './Citas.css'

const appointmentOptionsByType = {
  Veterinaria: ['Consulta general', 'Vacunas', 'Control'],
  'Estética': ['Baño', 'Corte', 'Baño y corte'],
  Entrenamiento: ['Adiestramiento', 'Obediencia', 'Relajación'],
  Funerarios: ['Protocolo de despedida', 'Cremación', 'Entierro'],
  Marketing: ['Campaña digital', 'Fidelización de clientes'],
}

function getLocalDateValue(date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function AppointmentList({ title, appointments, emptyMessage }) {
  return (
    <section className="my-appointments-group" aria-label={title}>
      <h3>{title} <span>{appointments.length}</span></h3>
      {appointments.length === 0 ? (
        <p className="my-appointments-empty">{emptyMessage}</p>
      ) : (
        <ul className="my-appointments-list">
          {appointments.map((appointment, index) => (
            <li key={`${appointment.correo}-${appointment.fecha}-${appointment.hora}-${index}`}>
              <div className="my-appointment-top">
                <strong>{appointment.tipoCita}</strong>
                <time dateTime={`${appointment.fecha}${appointment.hora ? `T${appointment.hora}` : ''}`}>
                  {appointment.fecha}{appointment.hora ? ` · ${appointment.hora}` : ''}
                </time>
              </div>
              <p><span>Mascota:</span> {appointment.nombreMascota}</p>
              {appointment.detalles && <p><span>Detalles:</span> {appointment.detalles}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Citas() {
  const [citas, setCitas] = useState(() => citasIniciales.map((cita) => ({ ...cita })))
  const [correo, setCorreo] = useState('')
  const [correoBuscado, setCorreoBuscado] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const citasEncontradas = useMemo(() => {
    if (!correoBuscado) return []

    return citas.filter(
      (cita) => cita.correo.trim().toLowerCase() === correoBuscado,
    )
  }, [citas, correoBuscado])

  const citasPendientes = citasEncontradas
    .filter((cita) => cita.estado === 'pendiente')
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
  const historial = citasEncontradas
    .filter((cita) => cita.estado === 'completada')
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  const today = getLocalDateValue(new Date())

  function handleSearch(event) {
    event.preventDefault()
    setCorreoBuscado(correo.trim().toLowerCase())
    setConfirmation('')
  }

  function handleBooking(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const nuevaCita = {
      correo: formData.get('bookingEmail').toString().trim(),
      nombreMascota: formData.get('petName').toString().trim(),
      tipoCita: formData.get('serviceType').toString(),
      fecha: formData.get('date').toString(),
      hora: formData.get('time').toString(),
      detalles: [
        formData.get('appointmentReason').toString(),
        formData.get('details').toString().trim(),
      ].filter(Boolean).join(' — '),
      estado: 'pendiente',
    }

    setCitas((citasActuales) => [...citasActuales, nuevaCita])
    setCorreo(nuevaCita.correo)
    setCorreoBuscado(nuevaCita.correo.toLowerCase())
    setConfirmation('Cita agregada a la lista de citas en memoria.')
    setSelectedService('')
    setSelectedReason('')
    form.reset()
  }

  return (
    <section className="appointments-page section-wrap" aria-labelledby="appointments-title">
      <header className="appointments-header">
        <span className="eyebrow">Mascotas Pro · Tu cuenta</span>
        <h1 id="appointments-title">Mis citas</h1>
        <p>Consulta tus próximas citas y revisa tu historial usando el correo asociado a tu solicitud.</p>
      </header>

      <form className="appointments-search" onSubmit={handleSearch}>
        <label htmlFor="appointments-email">Correo electrónico</label>
        <div className="appointments-search-row">
          <input
            id="appointments-email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            required
          />
          <button className="button button-primary" type="submit">Buscar citas</button>
        </div>
      </form>

      {confirmation && <p className="appointments-confirmation" role="status">{confirmation}</p>}

      {correoBuscado && (
        <div className="appointments-results" aria-live="polite">
          {citasEncontradas.length === 0 ? (
            <p className="appointments-no-results">No hay citas registradas con este correo</p>
          ) : (
            <>
              <AppointmentList
                title="Citas pendientes"
                appointments={citasPendientes}
                emptyMessage="No tienes citas pendientes."
              />
              <AppointmentList
                title="Historial de citas"
                appointments={historial}
                emptyMessage="Todavía no hay citas en tu historial."
              />
            </>
          )}
        </div>
      )}

      <div className="appointments-booking">
        <section className="appointments-booking-card" aria-labelledby="booking-title">
          <div className="appointments-booking-heading">
            <div>
              <span className="eyebrow">Estamos para ayudarte</span>
              <h2 id="booking-title">Agendar nueva cita</h2>
            </div>
          </div>

          <form className="appointments-booking-form" onSubmit={handleBooking}>
            <label htmlFor="booking-email">Correo electrónico</label>
            <input
              id="booking-email"
              name="bookingEmail"
              type="email"
              autoComplete="email"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              required
            />

            <label htmlFor="booking-service">Tipo de cita</label>
            <select
              id="booking-service"
              name="serviceType"
              value={selectedService}
              onChange={(event) => {
                setSelectedService(event.target.value)
                setSelectedReason('')
              }}
              required
            >
              <option value="" disabled>Selecciona un servicio</option>
              {Object.keys(appointmentOptionsByType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {selectedService && (
              <>
                <label htmlFor="booking-reason">Motivo de la cita</label>
                <select
                  id="booking-reason"
                  name="appointmentReason"
                  value={selectedReason}
                  onChange={(event) => setSelectedReason(event.target.value)}
                  required
                >
                  <option value="" disabled>Selecciona el motivo</option>
                  {appointmentOptionsByType[selectedService].map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </>
            )}

            <label htmlFor="booking-pet">Nombre de la mascota</label>
            <input id="booking-pet" name="petName" type="text" required />

            <div className="appointments-form-row">
              <div>
                <label htmlFor="booking-date">Fecha preferida</label>
                <input
                  id="booking-date"
                  name="date"
                  type="date"
                  min={today}
                  required
                />
              </div>
              <div>
                <label htmlFor="booking-time">Hora preferida (opcional)</label>
                <input id="booking-time" name="time" type="time" />
              </div>
            </div>

            <label htmlFor="booking-details">Detalles adicionales (opcional)</label>
            <textarea
              id="booking-details"
              name="details"
              rows="4"
              placeholder="Describe brevemente el motivo de la cita."
            />

            <button className="button button-primary" type="submit">Guardar cita</button>
          </form>
        </section>
      </div>
    </section>
  )
}

export default Citas
