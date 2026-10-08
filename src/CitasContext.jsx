import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import citasIniciales from './citas.json'

const CitasContext = createContext(null)
const appointmentsStorageKey = 'mascotasProAppointments'

function getInitialState() {
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

  const agregarCita = useCallback(async (cita) => {
    try {
      const updatedAppointments = [...citas, cita]
      window.localStorage.setItem(
        appointmentsStorageKey,
        JSON.stringify(updatedAppointments),
      )
      setCitas(updatedAppointments)
      setStorageError('')
      return cita
    } catch (error) {
      console.error('No se pudo guardar la cita en localStorage.', error)
      setStorageError('No se pudo guardar la cita en el almacenamiento local.')
      throw error
    }
  }, [citas])

  const reemplazarCitas = useCallback(async (citasActualizadas) => {
    try {
      window.localStorage.setItem(
        appointmentsStorageKey,
        JSON.stringify(citasActualizadas),
      )
      setCitas(citasActualizadas)
      setStorageError('')
      return citasActualizadas
    } catch (error) {
      console.error('No se pudieron actualizar las citas en localStorage.', error)
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
