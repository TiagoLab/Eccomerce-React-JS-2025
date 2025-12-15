import { Link, useParams, useLocation } from "react-router-dom"

const DetalleCamioneta = () => {
  const { id, nombre } = useParams()
  const location = useLocation()
  const camioneta = location.state?.camioneta

  if (!camioneta) {
    return (
      <>
        <p className="fs-5 fw-bold text-center">No se pudo cargar el vehículo</p>
        <Link to={"/camionetas"}>
          <button className="btn px-5 fs-5 fw-bold bg-success-subtle rounded">
            Mostrar otras camionetas
          </button>
        </Link>
      </>
    )
  }

  return (
    <>
      <h2
        style={{ paddingTop: '70px' }}
        className="text-center fs-4 fw-bold mt-3"
      >
        Detalles del vehículo { [id, ": ", nombre] }
      </h2>

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm rounded">
              <div key={camioneta.id} className="card-body bg-info-subtle rounded">
                <img
                  src={camioneta.imagen}
                  className="card-img-top img-fluid rounded"
                  alt={camioneta.nombre}
                />

                <div className="mt-3 text-center bg-secondary-subtle rounded pt-3 pb-3">
                  <h3 className="card-title fw-bold fs-5">{camioneta.nombre}</h3>

                  <p className="card-text fs-5">{camioneta.descripcion}</p>

                  <p className="text-muted fw-bold bg-info-subtle fs-5">
                    $ {camioneta.precio}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to={`/camionetas`}>
            <button className="btn px-5 fs-5 fw-bold bg-success-subtle rounded">
              Ver otras camionetas
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default DetalleCamioneta
