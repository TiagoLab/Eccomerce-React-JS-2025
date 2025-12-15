import { createContext, useState, useContext, useEffect } from 'react'

export const AutosContext = createContext()

export const AutosProvider = ({ children }) => {
  const [autos, setAutos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const validarAuto = (auto) => {
    const errores = {}

    if (!auto.nombre?.trim()) {
      errores.nombre = 'El nombre del vehículo es obligatorio.'
    }

    if (!auto.precio?.toString().trim()) {
      errores.precio = 'El precio es obligatorio.'
    } else {
      const precioLimpio = auto.precio.toString().replace(/\./g, '').replace(',', '.')
      const precioNumerico = parseFloat(precioLimpio)

      if (!/^[\d.,]+$/.test(auto.precio.toString().replace(/\./g, ''))) {
        errores.precio = 'Solo números, puntos o comas.'
      } else if (isNaN(precioNumerico)) {
        errores.precio = 'Precio no válido.'
      } else if (precioNumerico <= 0) {
        errores.precio = 'Debe ser mayor a 0.'
      }
    }

    if (!auto.descripcion?.trim()) {
      errores.descripcion = 'La descripción es obligatoria.'
    } else if (auto.descripcion.length < 10) {
      errores.descripcion = 'Mínimo 10 caracteres.'
    } else if (auto.descripcion.length > 200) {
      errores.descripcion = 'Máximo 200 caracteres.'
    }

    return errores
  }

  const validar = (auto) => {
    const errores = validarAuto(auto)
    return {
      esValido: Object.keys(errores).length === 0,
      errores
    }
  }

  useEffect(() => {
    const cargarAutos = async () => {
      try {
        const respuesta = await fetch('https://68d6f23ec2a1754b426c4d01.mockapi.io/autos')
        if (!respuesta.ok) throw new Error('Error al cargar vehículos')

        const datos = await respuesta.json()
        setAutos(datos)
      } catch (error) {
        console.error('Error al cargar vehículos:', error)
        setError("Hubo un problema al cargar los vehículos.")
      } finally {
        setCargando(false)
      }
    }

    cargarAutos()
  }, [])

  const agregarAuto = async (nuevoAuto) => {
    try {
      const respuesta = await fetch('https://68d6f23ec2a1754b426c4d01.mockapi.io/autos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoAuto),
      })

      if (!respuesta.ok) throw new Error('Error al agregar el vehículo')

      const data = await respuesta.json()
      setAutos(prev => [...prev, data])
      return data
    } catch (error) {
      console.error('Error al agregar el vehículo:', error)
      throw error
    }
  }

  const editarAuto = async (autoActualizado) => {
    try {
      const respuesta = await fetch(`https://68d6f23ec2a1754b426c4d01.mockapi.io/autos/${autoActualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoActualizado),
      })

      if (!respuesta.ok) throw new Error('Error al editar el vehículo')

      const data = await respuesta.json()
      setAutos(prev =>
        prev.map(auto =>
          auto.id === autoActualizado.id ? data : auto
        )
      )
      return data
    } catch (error) {
      console.error('Error al editar el vehículo:', error)
      throw error
    }
  }

  return (
    <AutosContext.Provider
      value={{
        autos,
        cargando,
        error,
        agregarAuto,
        editarAuto,
        validarAuto,
        validar
      }}>
      {children}
    </AutosContext.Provider>
  )
}

export const useAutos = () => {
  const context = useContext(AutosContext)
  if (!context) {
    throw new Error('useAutos debe ser usado dentro de un AutosProvider')
  }
  return context
}
