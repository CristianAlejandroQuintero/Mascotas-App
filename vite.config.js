import { readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const appointmentsFile = fileURLToPath(new URL('./src/citas.json', import.meta.url))
const maxRequestSize = 16 * 1024
let writeQueue = Promise.resolve()

async function readAppointments() {
  const appointments = JSON.parse(await readFile(appointmentsFile, 'utf8'))
  if (!Array.isArray(appointments)) {
    throw new Error('El archivo citas.json debe contener un array.')
  }
  return appointments
}

async function writeAppointments(appointments) {
  const temporaryFile = `${appointmentsFile}.${process.pid}.tmp`

  try {
    await writeFile(temporaryFile, `${JSON.stringify(appointments, null, 2)}\n`, 'utf8')
    await rename(temporaryFile, appointmentsFile)
  } catch (error) {
    await unlink(temporaryFile).catch(() => {})
    throw error
  }
}

async function readRequestBody(request) {
  const chunks = []
  let size = 0

  for await (const chunk of request) {
    size += chunk.length
    if (size > maxRequestSize) {
      const error = new Error('La solicitud excede el tamaño permitido.')
      error.statusCode = 413
      throw error
    }
    chunks.push(chunk)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    const error = new Error('El cuerpo de la solicitud debe ser JSON válido.')
    error.statusCode = 400
    throw error
  }
}

function validateAppointment(value) {
  const fields = ['correo', 'nombreMascota', 'tipoCita', 'fecha', 'hora', 'detalles', 'estado']
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    fields.some((field) => typeof value[field] !== 'string')
  ) {
    const error = new Error('La cita debe incluir correo, nombreMascota, tipoCita, fecha, hora, detalles y estado.')
    error.statusCode = 400
    throw error
  }

  if (
    !value.correo.trim() ||
    !value.nombreMascota.trim() ||
    !value.tipoCita.trim() ||
    !['pendiente', 'completada'].includes(value.estado) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value.fecha)
  ) {
    const error = new Error('La cita contiene datos obligatorios inválidos.')
    error.statusCode = 400
    throw error
  }

  return Object.fromEntries(fields.map((field) => [field, value[field]]))
}

function sendJson(response, statusCode, data) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(data))
}

function appointmentsApi() {
  return {
    name: 'appointments-json-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const requestUrl = new URL(request.url || '/', 'http://localhost')
        if (requestUrl.pathname !== '/api/citas') {
          next()
          return
        }

        async function handleRequest() {
          if (request.method === 'GET') {
            await writeQueue
            sendJson(response, 200, await readAppointments())
            return
          }

          if (!['POST', 'PUT'].includes(request.method)) {
            response.setHeader('Allow', 'GET, POST, PUT')
            sendJson(response, 405, { error: 'Método no permitido.' })
            return
          }

          const requestBody = await readRequestBody(request)
          const saveAppointments = async () => {
            const appointments = await readAppointments()
            if (request.method === 'POST') {
              const appointment = validateAppointment(requestBody)
              appointments.push(appointment)
              await writeAppointments(appointments)
              return { appointment, appointments }
            }

            if (
              !requestBody ||
              !Array.isArray(requestBody.appointments)
            ) {
              const error = new Error('La solicitud debe incluir un array de citas.')
              error.statusCode = 400
              throw error
            }

            const updatedAppointments = requestBody.appointments.map(validateAppointment)
            await writeAppointments(updatedAppointments)
            return { appointments: updatedAppointments }
          }

          const pendingWrite = writeQueue.then(saveAppointments)
          writeQueue = pendingWrite.catch(() => {})
          const result = await pendingWrite
          sendJson(response, request.method === 'POST' ? 201 : 200, result)
        }

        handleRequest().catch((error) => {
          console.error('Error en la API de citas:', error)
          if (!response.headersSent) {
            sendJson(response, error.statusCode || 500, {
              error: error.statusCode ? error.message : 'No se pudo procesar la solicitud de citas.',
            })
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [appointmentsApi(), react()],
  base: '/Mascotas-App/',
})
