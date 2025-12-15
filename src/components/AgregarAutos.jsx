import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AgregarAutos() {

  const [auto, setAuto] = useState({
    imagen: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
  })

  const navigate = useNavigate()
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)

  const manejarCambio = (e) => {
    const { name, value } = e.target

    if (name === "descripcion" && value.length > 200) return

    setAuto((prev) => ({ ...prev, [name]: value }))

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validarFormulario = () => {
    const errorDeCarga = {}

    if (!auto.nombre.trim()) {
      errorDeCarga.nombre = "El nombre del vehículo es obligatorio."
    }

    if (!auto.precio.trim()) {
      errorDeCarga.precio = "El precio es obligatorio."
    } else {
      const precioLimpio = auto.precio.replace(/\./g, "").replace(",", ".")
      const precioNumerico = parseFloat(precioLimpio)

      if (!/^[\d.,]+$/.test(auto.precio.replace(/\./g, ""))) {
        errorDeCarga.precio = "Solo números, puntos o comas."
      } else if (isNaN(precioNumerico)) {
        errorDeCarga.precio = "Precio no válido."
      } else if (precioNumerico <= 0) {
        errorDeCarga.precio = "Debe ser mayor a 0."
      }
    }

    if (!auto.descripcion.trim()) {
      errorDeCarga.descripcion = "La descripción es obligatoria."
    } else if (auto.descripcion.length < 10) {
      errorDeCarga.descripcion = "Mínimo 10 caracteres."
    } else if (auto.descripcion.length > 200) {
      errorDeCarga.descripcion = "Máximo 200 caracteres."
    }

    setErrores(errorDeCarga)
    return Object.keys(errorDeCarga).length === 0
  }

  // Agregar auto
  const agregarAuto = async (auto) => {
    try {
      const autoEnviar = {
        ...auto,
        precio: auto.precio.replace(",", "."),
      }

      const respuesta = await fetch(
        "https://68d6f23ec2a1754b426c4d01.mockapi.io/autos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(autoEnviar),
        }
      )

      if (!respuesta.ok) throw new Error("Error al agregar el vehículo.")

      const data = await respuesta.json()
      alert("El vehículo fue agregado correctamente")
      return data
    } catch (error) {
      alert("Hubo un problema al agregar el vehículo.")
      throw error
    }
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setCargando(true)
    try {
      await agregarAuto(auto)

      const agregarOtro = window.confirm(
        'Vehículo agregado correctamente!\n\n¿Desea agregar otro vehículo?\n\n• "Aceptar": Agrega otro vehículo\n• "Cancelar": Redirige a la lista de vehículos'
      )

      if (agregarOtro) {
        setAuto({ imagen: "", nombre: "", descripcion: "", categoria: "", precio: "" })
        setErrores({})
      } else {
        setTimeout(() => {
          navigate("/autos")
        }, 100)
      }

      setAuto({
        imagen: "",
        nombre: "",
        descripcion: "",
        categoria: "",
        precio: "",
      })
      setErrores({})
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="mx-auto p-4 border rounded-3 shadow-sm w-100 w-md-75 w-lg-50">

      <h2 className="fw-bold mb-4 text-center text-primary">Agregar Vehículo</h2>

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

      <button
        type="submit"
        disabled={cargando}
        className={`btn w-100 fw-semibold rounded-2 ${cargando ? "btn-secondary" : "btn-success"}`}
      >
        {cargando ? "Agregando..." : "Agregar Vehículo"}
      </button>

      <p className="mt-2 text-muted small fst-italic">(*) Campos obligatorios</p>
    </form>
  )
}

export default AgregarAutos
