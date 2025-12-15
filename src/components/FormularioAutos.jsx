import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAutos } from '../context/AutosContext'
import { toast } from "react-toastify"

function FormularioAutos() {
  const navigate = useNavigate()
  const location = useLocation()
  const { agregarAuto, editarAuto, validar } = useAutos()

  const autoRecibido = location.state?.auto

  const modo = autoRecibido ? "editar" : "agregar"

  const [auto, setAuto] = useState({
    id: '',
    imagen: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: ''
  })

  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (modo === "editar" && autoRecibido) {
      setAuto({
        id: autoRecibido.id || '',
        imagen: autoRecibido.imagen || '',
        nombre: autoRecibido.nombre || '',
        descripcion: autoRecibido.descripcion || '',
        categoria: autoRecibido.categoria || '',
        precio: autoRecibido.precio || ''
      })
    }
  }, [modo, autoRecibido])

  const manejarCambio = (e) => {
    const { name, value } = e.target

    if (name === 'descripcion' && value.length > 200) return

    setAuto(prev => ({ ...prev, [name]: value }))

    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validarFormulario = () => {
    const resultado = validar(auto)
    setErrores(resultado.errores)
    return resultado.esValido
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setCargando(true)
    try {
      const autoEnviar = {
        ...auto,
        precio: auto.precio.toString().replace(',', '.')
      }

      if (modo === "agregar") {
        const nuevoAuto = await agregarAuto(autoEnviar)
        toast.success(`Vehículo "${nuevoAuto.nombre}" agregado correctamente (ID: ${nuevoAuto.id})`)

        setAuto({
          id: '',
          imagen: '',
          nombre: '',
          descripcion: '',
          categoria: '',
          precio: ''
        })

        setTimeout(() => {
          navigate('/autos')
        }, 100)

      } else {
        await editarAuto(autoEnviar)
        toast.success("Vehículo actualizado correctamente!")

        setTimeout(() => {
          navigate('/autos')
        }, 100)
      }

      setErrores({})

    } catch (error) {
      toast.warn(`Hubo un problema al ${modo === "editar" ? 'actualizar' : 'agregar'} el vehículo.`)
      console.error('Error:', error)
    } finally {
      setCargando(false)
    }
  }

  const cancelarEdicion = () => {
    if (modo === "editar") {
      toast('Edición cancelada')
      navigate('/autos')
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="mx-auto p-4 border rounded-3 shadow-sm w-100 w-md-75 w-lg-50">
      <h2 className="fw-bold mb-4 text-center text-primary">
        {modo === "editar" ? 'Editar Vehículo' : 'Agregar Vehículo'}
      </h2>

      {modo === "editar" && autoRecibido && (
        <p className="text-center text-secondary mb-4">
          Editando: {autoRecibido.nombre} (ID: {autoRecibido.id})
        </p>
      )}

      <div className="mb-3">
        <label className="form-label fw-semibold">Nombre: *</label>
        <input
          type="text"
          name="nombre"
          value={auto.nombre}
          onChange={manejarCambio}
          disabled={cargando}
          className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
          placeholder="Ingrese el nombre del vehículo"
        />
        {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Precio: *</label>
        <input
          type="text"
          name="precio"
          value={auto.precio}
          onChange={manejarCambio}
          disabled={cargando}
          placeholder="Ej: 1.500.000 o 1.500.000,50"
          inputMode="decimal"
          className={`form-control ${errores.precio ? "is-invalid" : ""}`}
        />
        <div className="form-text text-muted">
          Formato argentino: punto para miles, coma para decimales.
        </div>
        {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Categoría:</label>
        <input
          type="text"
          name="categoria"
          value={auto.categoria}
          onChange={manejarCambio}
          disabled={cargando}
          placeholder="Ej: Sedán, SUV, Hatchback, etc."
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Imagen (URL):</label>
        <input
          type="text"
          name="imagen"
          value={auto.imagen}
          onChange={manejarCambio}
          disabled={cargando}
          placeholder="https://i.imgur.com/ejemplo.png"
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Descripción: *</label>
        <textarea
          name="descripcion"
          value={auto.descripcion}
          onChange={manejarCambio}
          rows="4"
          disabled={cargando}
          maxLength="200"
          placeholder="Mínimo 10 caracteres, máximo 200 caracteres"
          className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
        />
        <div className={`form-text ${auto.descripcion.length > 200 ? "text-danger" : "text-muted"}`}>
          {auto.descripcion.length}/200 caracteres
        </div>
        {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
      </div>

      <div className="mb-3 d-flex gap-3 justify-content-center flex-column flex-md-row">
        <button
          type="submit"
          disabled={cargando}
          className={`btn btn-secondary fw-bold flex-fill py-2 mt-4 rounded-2 ${cargando ? "btn-secondary" : "btn-success"}`}
        >
          {cargando
            ? (modo === "editar" ? 'Actualizando...' : 'Agregando...')
            : (modo === "editar" ? 'Confirmar Cambios' : 'Agregar Vehículo')
          }
        </button>

        {modo === "editar" && (
          <button
            type="button"
            onClick={cancelarEdicion}
            className="btn btn-secondary fw-bold flex-fill py-2 mt-4 rounded-2"
          >
            Cancelar
          </button>
        )}
      </div>

      <p>(*) Campos obligatorios</p>
    </form>
  )
}

export default FormularioAutos
