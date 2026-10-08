const contactMessageFields = ['nombre', 'correo', 'mensaje']

function normalizeContactMessages(value) {
  if (!Array.isArray(value)) {
    throw new Error('El almacenamiento de mensajes no contiene una lista.')
  }

  return value.map((message) => {
    if (
      !message ||
      typeof message !== 'object' ||
      Array.isArray(message) ||
      contactMessageFields.some((field) => typeof message[field] !== 'string')
    ) {
      throw new Error('Un mensaje guardado no tiene el formato esperado.')
    }

    return Object.fromEntries(
      contactMessageFields.map((field) => [field, message[field]]),
    )
  })
}

export { normalizeContactMessages }
