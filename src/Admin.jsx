import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCitas } from './CitasContext.jsx'
import './Admin.css'

function formatDate(value) {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function Admin({ session }) {
  const navigate = useNavigate()
  const { citas, storageError } = useCitas()
  const [actionError, setActionError] = useState('')

  function handleLogout() {
    try {
      window.localStorage.removeItem('mascotasProSession')
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('No se pudo cerrar la sesión.', error)
      setActionError('No se pudo cerrar la sesión en este navegador.')
    }
  }

  const appointmentHistory = citas
    .map((appointment, index) => ({ appointment, index }))
    .sort((first, second) => second.appointment.fecha.localeCompare(first.appointment.fecha))

  return (
    <section className="admin-page section-wrap" aria-labelledby="admin-title">
      <header className="admin-header">
        <div>
          <span className="eyebrow">Mascotas Pro · Panel interno</span>
          <h1 id="admin-title">Panel de administración</h1>
          <p>
            Sesión iniciada como <strong>{session.correo}</strong>
            · Rol: <strong>{session.rol}</strong>.
          </p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-logout" type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {storageError && <p className="admin-error" role="alert">{storageError}</p>}
      {actionError && <p className="admin-error" role="alert">{actionError}</p>}

      <section className="admin-section" aria-labelledby="admin-appointments-title">
        <div className="admin-section-heading">
          <div>
            <span className="eyebrow">Agenda</span>
            <h2 id="admin-appointments-title">Historial de citas <span>{citas.length}</span></h2>
          </div>
        </div>

        <AppointmentGroup
          title="Citas registradas"
          appointments={appointmentHistory}
          emptyMessage="Todavía no hay citas registradas."
        />
      </section>
    </section>
  )
}

function AppointmentGroup({
  title,
  appointments,
  emptyMessage,
}) {
  return (
    <section className="admin-appointment-group" aria-label={title}>
      <h3>{title} <span>{appointments.length}</span></h3>
      {appointments.length === 0 ? (
        <p className="admin-empty">{emptyMessage}</p>
      ) : (
        <ul className="admin-appointments">
          {appointments.map(({ appointment, index }) => (
            <li key={`${appointment.correo}-${appointment.fecha}-${appointment.hora}-${index}`}>
              <div className="admin-appointment-content">
                <div className="admin-appointment-heading">
                  <strong>{appointment.tipoCita}</strong>
                  <span className={`admin-status is-${appointment.estado}`}>
                    {appointment.estado}
                  </span>
                </div>
                <p><b>Mascota:</b> {appointment.nombreMascota}</p>
                <p><b>Correo:</b> {appointment.correo}</p>
                <p><b>Fecha:</b> {formatDate(appointment.fecha)}{appointment.hora ? ` · ${appointment.hora}` : ''}</p>
                {appointment.detalles && <p><b>Detalles:</b> {appointment.detalles}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Admin
