import { Link, useNavigate } from "react-router-dom"
import { useCartContext } from "../context/CartContext"
import { useAuthContext } from "../context/AuthContext"
import { useAutos } from "../context/AutosContext"

export default function Autos() {
    const { autos, cargando, error } = useAutos()
    const { addToCart } = useCartContext()
    const { esAdmin } = useAuthContext()
    const navigate = useNavigate()

    const manejarEliminar = (auto) => {
        navigate('/eliminar-autos', { state: { auto } })
    }

    const manejarEditar = (auto) => {
        navigate('/formulario-autos', { state: { auto } })
    }

    if (cargando) return <p>Cargando vehículos...</p>
    if (error) return <p>{error}</p>

    return (
        <>
            <h4 className="text-center bg-info-subtle fs-5 fw-bold mb-4 p-3 text-primary">
                CATÁLOGO DE VEHÍCULOS DISPONIBLES
            </h4>

            <ul className="d-flex flex-wrap justify-content-center text-center gap-4 list-unstyled p-0">
                {autos.map((auto) => (
                    <AutoItem
                        key={auto.id}
                        auto={auto}
                        esAdmin={esAdmin}
                        onEditar={() => manejarEditar(auto)}
                        onEliminar={() => manejarEliminar(auto)}
                        onAddToCart={() => addToCart(auto)}
                    />
                ))}
            </ul>
        </>
    )
}

const AutoItem = ({ auto, esAdmin, onEditar, onEliminar, onAddToCart }) => (
    <li
        className="card shadow-lg fs-6 border-secondary-subtle bg-info-subtle rounded vehiculo"
        style={{ width: "300px" }}
    >
        <img
            className="card-img-top rounded-4 p-2"
            src={auto.imagen}
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
            alt={auto.nombre}
        />

        <span className="fw-bold fs-5 mt-2 pb-1">{auto.nombre}</span>
        <span className="fs-6 px-2 pb-1"><strong>Descripción:</strong> {auto.descripcion}</span>
        <span className="fs-6 pb-1"><strong>Categoría:</strong> {auto.categoria}</span>
        <span className="fw-bold fs-6 pb-3">Precio: $ {auto.precio}</span>

        <div className="btn-admin-container pb-3 pt-3 border-bottom border-top border-secondary-subtle">
            <button
                className="btn text-light bg-success m-2 rounded fs-6"
                onClick={onAddToCart}
            >
                Agregar al carrito
            </button>

            <Link to={`/autos/${auto.id}/${auto.nombre}`} state={{ auto }}>
                <button className="btn text-light bg-primary m-2 fs-6 rounded">
                    Más detalles
                </button>
            </Link>
        </div>

        {esAdmin && (
            <div className="btn-admin-container bg-secondary pt-3">
                <button
                    onClick={onEditar}
                    className="btn text-light mb-4 bg-success m-2 fs-6 rounded"
                >
                    Editar
                </button>

                <button
                    onClick={onEliminar}
                    className="btn text-light mb-4 bg-danger m-2 fs-6 rounded"
                >
                    Eliminar
                </button>
            </div>
        )}
    </li>
)
