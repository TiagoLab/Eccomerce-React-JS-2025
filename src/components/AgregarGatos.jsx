import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AgregarGatos() {

  const [gatos, setGatos] = useState({
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

    setGatos((prev) => ({ ...prev, [name]: value }))

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validarFormulario = () => {
    const errorDeCarga = {}

    if (!gatos.nombre.trim()) {
      errorDeCarga.nombre = "El nombre es obligatorio."
    }

    if (!gatos.precio.trim()) {
      errorDeCarga.precio = "El precio es obligatorio."
    } else {
      const precioLimpio = gatos.precio.replace(/\./g, "").replace(",", ".")
      const precioNumerico = parseFloat(precioLimpio)

      if (!/^[\d.,]+$/.test(gatos.precio.replace(/\./g, ""))) {
        errorDeCarga.precio = "Solo números, puntos o comas."
      } else if (isNaN(precioNumerico)) {
        errorDeCarga.precio = "Precio no válido."
      } else if (precioNumerico <= 0) {
        errorDeCarga.precio = "Debe ser mayor a 0."
      }
    }

    if (!gatos.descripcion.trim()) {
      errorDeCarga.descripcion = "La descripción es obligatoria."
    } else if (gatos.descripcion.length < 10) {
      errorDeCarga.descripcion = "Mínimo 10 caracteres."
    } else if (gatos.descripcion.length > 200) {
      errorDeCarga.descripcion = "Máximo 200 caracteres."
    }

    setErrores(errorDeCarga);
    return Object.keys(errorDeCarga).length === 0
  }

  // Agregar gatos
  const agregarGatos = async (gatos) => {
    try {
      const gatoEnviar = {
        ...gatos,
        precio: gatos.precio.replace(",", "."),
      }

      const respuesta = await fetch(
        'https://68d6f23ec2a1754b426c4d01.mockapi.io/gatos',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gatoEnviar),
        }
      )

      if (!respuesta.ok) throw new Error("Error al agregar la mascota.");

      const data = await respuesta.json()
      alert("La mascota fue agregada correctamente")
      return data
    } catch (error) {
      alert("Hubo un problema al agregar la mascota.")
      throw error
    }
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setCargando(true)
    try {
      await agregarGatos(gatos)

      const agregarOtro = window.confirm('Mascota agregada correctamente!\n\n¿Desea agregar otra mascota?\n\n• "Aceptar": Agrega otra mascota\n• "Cancelar": Redirige a la lista de mascotas')

      if (agregarOtro) {
        setGatos({ imagen: '', nombre: '', descripcion: '', categoria: '', precio: '' })
        setErrores({})
      } else {    
        setTimeout(() => {
          navigate('/gatos')
        }, 100)
      }

      setGatos({
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
      
      <h2 className="fw-bold mb-4 text-center text-primary">Agregar Mascota (gato)</h2>

      <div className="mb-3">
        <label className="form-label fw-semibold">Nombre: *</label>
        <input
          type="text"
          name="nombre"
          value={gatos.nombre}
          onChange={manejarCambio}
          disabled={cargando}
          className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
          placeholder="Ingrese el nombre de la mascota (gato)"
        />
        {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Precio: *</label>
        <input
          type="text"
          name="precio"
          value={gatos.precio}
          onChange={manejarCambio}
          disabled={cargando}
          placeholder="Ej: 40.000 o 40.000,50"
          inputMode="decimal"
          className={`form-control ${errores.precio ? "is-invalid" : ""}`}
        />
        <div className="form-text text-muted">
          Formato argentino: punto para miles, sin decimales.
        </div>
        {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Categoría:</label>
        <input
          type="text"
          name="categoria"
          value={gatos.categoria}
          onChange={manejarCambio}
          disabled={cargando}
          placeholder="Ej: Pelo semilargo, Pelo corto oriental, etc."
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Imagen (URL):</label>
        <input
          type="text"
          name="imagen"
          value={gatos.imagen}
          onChange={manejarCambio}
          disabled={cargando}
          placeholder="https://i.imgur.com/JriKJW5.png"
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Descripción: *</label>
        <textarea
          name="descripcion"
          value={gatos.descripcion}
          onChange={manejarCambio}
          rows="4"
          disabled={cargando}
          maxLength="200"
          placeholder="Mínimo 10 caracteres, máximo 200 caracteres"
          className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
        />
        <div className={`form-text ${gatos.descripcion.length > 200 ? "text-danger" : "text-muted"}`}>
          {gatos.descripcion.length}/200 caracteres
        </div>
        {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
      </div>

      <button
        type="submit"
        disabled={cargando}
        className={`btn w-100 fw-semibold rounded-2 ${cargando ? "btn-secondary" : "btn-success"}`}
      >
        {cargando ? "Agregando..." : "Agregar Mascota"}
      </button>

      <p className="mt-2 text-muted small fst-italic">(*) Campos obligatorios</p>
    </form>
  )
}
export default AgregarGatos