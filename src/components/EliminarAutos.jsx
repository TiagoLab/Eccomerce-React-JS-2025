import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

function EliminarAutos() {
  const location = useLocation()
  const navigate = useNavigate()
  const auto = location.state?.auto

  const [cargando, setCargando] = useState(false)

  const eliminarAuto = async () => {
    if (!auto) return

    setCargando(true)
    try {
      const respuesta = await fetch(
        `https://68d6f23ec2a1754b426c4d01.mockapi.io/autos/${auto.id}`,
        { method: 'DELETE' }
      )

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el vehículo.')
      }

      toast.success("El vehículo fue eliminado correctamente!")

      navigate('/autos')
      setTimeout(() => {
        window.location.reload()
      }, 100)

    } catch (error) {
      console.error(error.message)
      toast.error('Hubo un problema al eliminar el vehículo.')
    } finally {
      setCargando(false)
    }
  }

  const manejarEliminar = () => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar el vehículo "${auto.nombre}"?\n\nEsta acción no se puede deshacer.`
    )

    if (confirmar) {
      eliminarAuto()
    }
  }

  return (
    <div className="mx-auto p-4 border rounded-3 shadow-sm w-100 w-md-75 w-lg-50">
      <h2 className="fw-bold mb-2 text-center text-primary">Eliminar Vehículo</h2>

      <div className="mb-3 bg-primary-subtle p-3 rounded-2">
        <h5 className="text-danger text-center pb-2 fw-bold">
          ¿Estás seguro de que deseas eliminar este vehículo?
        </h5>

        <div className="mb-3 p-2 rounded text-center bg-light-subtle">
          {auto.imagen && (
            <img
              src={auto.imagen}
              alt="Vehículo a eliminar"
              style={{ maxWidth: "100%", borderRadius: "6px" }}
            />
          )}
          <p className="mt-3 my-1"><strong>Nombre:</strong> {auto.nombre}</p>
          <p className="my-1 px-2"><strong>Descripción:</strong> {auto.descripcion}</p>
          <p className="my-1"><strong>Categoría:</strong> {auto.categoria || 'Sin categoría'}</p>
          <p className="my-1"><strong>Precio:</strong> ${auto.precio}</p>
        </div>

        <div className="bg-danger-subtle">
          <p className="text-center my-1 text-danger fw-bold">
            Esta acción no se puede deshacer.
          </p>
          <p className="text-center text-danger fw-bold pb-2">
            El vehículo será eliminado permanentemente.
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button
          onClick={manejarEliminar}
          disabled={cargando}
          className={`btn w-25 fw-semibold rounded-2 ${cargando ? "btn-secondary" : "btn-danger"}`}
        >
          {cargando ? 'Eliminando...' : 'Sí, Eliminar'}
        </button>

        <button
          onClick={() => navigate('/autos')}
          disabled={cargando}
          className="btn w-25 fw-semibold rounded-2 btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default EliminarAutos
