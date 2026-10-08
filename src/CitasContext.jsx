import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import citasIniciales from './citas.json'

const CitasContext = createContext(null)
const appointmentsStorageKey = 'mascotasProAppointments'

function getInitialState() {
  if (import.meta.env.DEV) {
    return { citas: citasIniciales, storageError: '' }
  }

  try {
    const storedAppointments = window.localStorage.getItem(appointmentsStorageKey)
    if (storedAppointments === null) {
      return { citas: citasIniciales, storageError: '' }
    }

    const parsedAppointments = JSON.parse(storedAppointments)
    if (!Array.isArray(parsedAppointments)) {
      throw new Error('El almacenamiento local no contiene una lista de citas.')
    }
    return { citas: parsedAppointments, storageError: '' }
  } catch (error) {
    console.error('No se pudieron cargar las citas desde localStorage.', error)
    return {
      citas: citasIniciales,
      storageError: 'No se pudieron cargar las citas guardadas en este dispositivo.',
    }
  }
}

function CitasProvider({ children }) {
  const [initialState] = useState(getInitialState)
  const [citas, setCitas] = useState(initialState.citas)
  const [storageError, setStorageError] = useState(initialState.storageError)

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return undefined
    }

    let active = true

    fetch('/api/citas')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`No se pudieron cargar las citas (HTTP ${response.status}).`)
        }
        return response.json()
      })
      .then((citasGuardadas) => {
        if (!Array.isArray(citasGuardadas)) {
          throw new Error('La respuesta del servidor no contiene una lista de citas.')
        }
        if (active) {
          setCitas(citasGuardadas)
          try {
            window.localStorage.setItem(
              appointmentsStorageKey,
              JSON.stringify(citasGuardadas),
            )
            setStorageError('')
          } catch (error) {
            console.error('No se pudieron sincronizar las citas con localStorage.', error)
            setStorageError('No se pudieron sincronizar las citas con el almacenamiento local.')
          }
        }
      })
      .catch((error) => {
        console.error('No se pudieron cargar las citas desde citas.json.', error)
        if (active) {
          setStorageError('No se pudieron cargar las citas guardadas. Intenta reiniciar el servidor.')
        }
      })

    return () => {
      active = false
    }
  }, [])

  const agregarCita = useCallback(async (cita) => {
    try {
      if (!import.meta.env.DEV) {
        const updatedAppointments = [...citas, cita]
        window.localStorage.setItem(
          appointmentsStorageKey,
          JSON.stringify(updatedAppointments),
        )
        setCitas(updatedAppointments)
        setStorageError('')
        return cita
      }

      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cita),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || `No se pudo guardar la cita (HTTP ${response.status}).`)
      }
      if (!Array.isArray(result.appointments)) {
        throw new Error('La respuesta del servidor no contiene una lista de citas válida.')
      }

      setCitas(result.appointments)
      try {
        window.localStorage.setItem(
          appointmentsStorageKey,
          JSON.stringify(result.appointments),
        )
      } catch (error) {
        console.error('La cita se guardó en citas.json pero no en localStorage.', error)
        throw new Error(
          'La cita se guardó en citas.json, pero no se pudo guardar en localStorage.',
          { cause: error },
        )
      }
      setStorageError('')
      return result.appointment
    } catch (error) {
      setStorageError('No se pudo guardar la cita en el almacenamiento disponible.')
      throw error
    }
  }, [citas])

  const reemplazarCitas = useCallback(async (citasActualizadas) => {
    try {
      if (!import.meta.env.DEV) {
        window.localStorage.setItem(
          appointmentsStorageKey,
          JSON.stringify(citasActualizadas),
        )
        setCitas(citasActualizadas)
        setStorageError('')
        return citasActualizadas
      }

      const response = await fetch('/api/citas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointments: citasActualizadas }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || `No se pudieron actualizar las citas (HTTP ${response.status}).`)
      }
      if (!Array.isArray(result.appointments)) {
        throw new Error('La respuesta del servidor no contiene una lista de citas válida.')
      }

      setCitas(result.appointments)
      try {
        window.localStorage.setItem(
          appointmentsStorageKey,
          JSON.stringify(result.appointments),
        )
      } catch (error) {
        console.error('Las citas se actualizaron en citas.json pero no en localStorage.', error)
        throw new Error(
          'Las citas se actualizaron en citas.json, pero no se pudieron guardar en localStorage.',
          { cause: error },
        )
      }
      setStorageError('')
      return result.appointments
    } catch (error) {
      setStorageError('No se pudieron actualizar las citas guardadas.')
      throw error
    }
  }, [])

  const value = useMemo(
    () => ({ citas, agregarCita, reemplazarCitas, storageError }),
    [citas, agregarCita, reemplazarCitas, storageError],
  )

  return <CitasContext.Provider value={value}>{children}</CitasContext.Provider>
}

function useCitas() {
  const context = useContext(CitasContext)
  if (!context) {
    throw new Error('useCitas debe utilizarse dentro de CitasProvider.')
  }

  return context
}

// The hook is exported with its provider so consumers share the same context.
// eslint-disable-next-line react-refresh/only-export-components
export { CitasProvider, useCitas }
