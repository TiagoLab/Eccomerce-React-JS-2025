import { Link, useParams, useLocation } from "react-router-dom"

const DetalleAuto = () => {
  const { id, nombre } = useParams()
  const location = useLocation()
  const auto = location.state?.auto

  if (!auto) {
    return (
      <>
        <p className="fs-5 fw-bold text-center">No se pudo cargar el vehículo</p>
        <Link to={"/autos"}>
          <button className="btn px-5 fs-5 fw-bold bg-success-subtle rounded">
            Mostrar otros vehículos
          </button>
        </Link>
      </>
    )
  }

  return (
    <>
      <h2 className="text-center fs-4 fw-bold mb-3">
        Detalles del vehículo { [id, ": ", nombre] }
      </h2>

      <div className="container rounded">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm rounded-3">
              <div key={auto.id} className="card-body bg-info-subtle rounded vehiculo">
                <img
                  src={auto.imagen}
                  className="card-img-top img-fluid rounded"
                  alt={auto.nombre}
                />

                <div className="mt-3 text-center bg-secondary-subtle rounded pt-3 pb-3">
                  <h3 className="card-title fw-bold fs-5">{auto.nombre}</h3>
                  <hr />

                  <p className="card-text fs-6 px-1">
                    <strong>Descripción: </strong>{auto.descripcion}
                  </p>
                  <hr />

                  <p className="card-text fs-6 px-1">
                    <strong>Categoría: </strong>{auto.categoria}
                  </p>

                  <p className="bg-info-subtle mb-1 p-2 fs-6">
                    <strong>Precio: $ </strong>{auto.precio}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to={`/autos`}>
            <button className="btn px-5 fw-bold fs-6 bg-success-subtle rounded">
              Ver otros vehículos
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default DetalleAuto
