import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usuarios from './usuarios.json'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const correo = formData.get('correo').toString().trim().toLowerCase()
    const password = formData.get('password').toString()
    const usuario = usuarios.find(
      (item) => item.correo.toLowerCase() === correo && item.password === password,
    )

    if (!usuario) {
      setError('Correo electrónico o contraseña incorrectos.')
      return
    }

    try {
      window.localStorage.setItem(
        'mascotasProSession',
        JSON.stringify({ correo: usuario.correo, rol: usuario.rol }),
      )
      setError('')
      navigate('/admin', { replace: true })
    } catch (storageError) {
      console.error('No se pudo guardar la sesión de usuario.', storageError)
      setError('No se pudo iniciar sesión en este navegador. Habilita el almacenamiento e inténtalo de nuevo.')
    }
  }

  return (
    <section className="login-page section-wrap" aria-labelledby="login-title">
      <div className="login-card">
        <span className="eyebrow">Mascotas Pro · Personal</span>
        <h1 id="login-title">Iniciar sesión</h1>
        <p>Ingresa con tu correo y contraseña para continuar al panel.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            name="correo"
            type="email"
            autoComplete="username"
            placeholder="correo@mascotaspro.com"
            required
          />

          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            required
          />

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="button button-primary" type="submit">
            Entrar <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
