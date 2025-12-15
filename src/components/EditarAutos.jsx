import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EditarAutos() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const autoOriginal = state.auto

    const [auto, setAuto] = useState({
        ...autoOriginal,
        categoria: autoOriginal.categoria || 'Sin categoría'
    })

    const [cargando, setCargando] = useState(false)
    const [errores, setErrores] = useState({})

    const manejarCambio = (e) => {
        const { name, value } = e.target
        setAuto(prev => ({ ...prev, [name]: value }))
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

    const manejarEnvio = async (e) => {
        e.preventDefault()
        if (!validarFormulario()) return

        setCargando(true)
        try {
            const autoEnviar = {
                ...auto,
                precio: auto.precio.replace(',', '.')
            }

            const respuesta = await fetch(
                `https://68d6f23ec2a1754b426c4d01.mockapi.io/autos/${auto.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(autoEnviar),
                }
            )

            if (!respuesta.ok) throw new Error('Error al actualizar')

            alert('Vehículo actualizado correctamente')
            navigate('/autos')

        } catch (error) {
            alert('Error al actualizar el vehículo')
            console.error(error)
        } finally {
            setCargando(false)
        }
    }

    const cancelarEdicion = () => {
        alert('Edición cancelada')
        navigate('/autos')
    }

    return (
        <form onSubmit={manejarEnvio} className="mx-auto p-4 border rounded-3 shadow-sm w-100 w-md-75 w-lg-50">

            <h2 className="fw-bold mb-4 text-center text-primary">Editar Vehículo</h2>

            <div className="mb-3">
                <label className="form-label fw-semibold">Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={auto.nombre}
                    onChange={manejarCambio}
                    disabled={cargando}
                    className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Precio:</label>
                <input
                    type="text"
                    name="precio"
                    value={auto.precio}
                    onChange={manejarCambio}
                    placeholder="Ej: 1.500.000 o 1.500.000,50"
                    className={`form-control ${errores.precio ? "is-invalid" : ""}`}
                />
                <small style={{ color: '#666' }}>Formato: punto para miles, coma para decimales</small>
                {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Categoría:</label>
                <input
                    type="text"
                    name="categoria"
                    value={auto.categoria}
                    onChange={manejarCambio}
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
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Descripción:</label>
                <textarea
                    name="descripcion"
                    value={auto.descripcion}
                    onChange={manejarCambio}
                    disabled={cargando}
                    rows="4"
                    maxLength="200"
                    placeholder="Mínimo 10 caracteres, máximo 200 caracteres"
                    className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
                />
                <div className={`form-text ${auto.descripcion.length > 200 ? "text-danger" : "text-muted"}`}>
                    {auto.descripcion.length}/200 caracteres
                </div>
                {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
            </div>

            <div className="d-flex gap-2">
                <button
                    type="submit"
                    disabled={cargando}
                    className={`btn ${cargando ? 'btn-secondary' : 'btn-success fw-bold'} flex-fill py-2 mt-4 rounded-2`}
                >
                    {cargando ? 'Actualizando...' : 'Confirmar Cambios'}
                </button>

                <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="btn btn-secondary fw-bold flex-fill py-2 mt-4 rounded-2"
                >
                    Cancelar
                </button>
            </div>

        </form>
    )
}

export default EditarAutos
