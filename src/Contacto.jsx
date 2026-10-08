import { useState } from 'react'
import './Contacto.css'
import { normalizeContactMessages } from './contactMessages.js'

function loadMessages() {
  try {
    return {
      messages: normalizeContactMessages(JSON.parse(
        window.localStorage.getItem('mascotasProMessages') || '[]',
      )),
      error: '',
    }
  } catch (error) {
    console.error('No se pudieron leer los mensajes guardados.', error)
    return {
      messages: [],
      error: 'No se pudieron cargar los mensajes guardados.',
    }
  }
}

function Contacto() {
  const [emailError, setEmailError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [{ messages, error: messagesError }, setMessageState] = useState(loadMessages)

  function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const nombre = formData.get('nombre').toString().trim()
    const correo = formData.get('correo').toString().trim()
    const mensaje = formData.get('mensaje').toString().trim()

    if (!correo) {
      setEmailError('El correo es obligatorio.')
      return
    }

    try {
      if (messagesError) {
        throw new Error(messagesError)
      }

      const updatedMessages = [...messages, {
        nombre,
        correo,
        mensaje,
      }]
      window.localStorage.setItem('mascotasProMessages', JSON.stringify(updatedMessages))
      setMessageState({ messages: updatedMessages, error: '' })
    } catch (error) {
      console.error('No se pudo guardar el mensaje de contacto.', error)
      setSubmitError('No se pudo guardar tu mensaje. Inténtalo de nuevo.')
      return
    }

    setEmailError('')
    setSubmitError('')
    window.alert('Tu mensaje fue enviado correctamente. Gracias por contactarnos.')
    form.reset()
  }

  return (
    <section className="contact-section section-wrap" id="contacto" aria-labelledby="contact-title">
      <div className="contact-heading">
        <span className="eyebrow">Estamos para ayudarte</span>
        <h2 id="contact-title">Hablemos de tu mascota</h2>
        <p>Déjanos tus datos y cuéntanos cómo podemos ayudarte.</p>
      </div>

      {messagesError && <p className="contact-error" role="alert">{messagesError}</p>}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="contact-name">Nombre</label>
        <input
          id="contact-name"
          name="nombre"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
        />

        <label htmlFor="contact-email">Correo</label>
        <input
          id="contact-email"
          name="correo"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'contact-email-error' : undefined}
          onChange={() => setEmailError('')}
        />
        {emailError && (
          <span className="contact-error" id="contact-email-error" role="alert">
            {emailError}
          </span>
        )}

        <label htmlFor="contact-message">Mensaje</label>
        <textarea
          id="contact-message"
          name="mensaje"
          rows="5"
          placeholder="¿En qué podemos ayudarte?"
        />

        {submitError && <span className="contact-error" role="alert">{submitError}</span>}
        <button className="button button-primary" type="submit">
          Enviar mensaje <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  )
}

export default Contacto
