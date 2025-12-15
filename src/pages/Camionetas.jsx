import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import datosCamionetas from "../assets/autos.json"    
import { useCartContext } from "../context/CartContext"

const Camionetas = () => {
    const [camionetas, setCamionetas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    const { addToCart } = useCartContext()

    useEffect(() => {

        console.log("COMPONENTE Camionetas MONTADO")

        const timeout = setTimeout(() => {
            console.log("TIMEOUT EJECUTADO")

            try {
                setCamionetas(datosCamionetas.autos)   
                setCargando(false)

            } catch (error) {
                console.error("Error:", error)
                setError("Hubo un problema al cargar las imágenes")
                setCargando(false)
            }
        }, 2000)

        return () => {
            clearTimeout(timeout)
            console.log("LIMPIEZA EJECUTADA")
            console.log("COMPONENTE Camionetas DESMONTADO")
        }

    }, [])

    if (cargando)
        return (
            <div className="text-center mt-6 fs-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-secondary">Cargando imágenes...</p>
            </div>
        )

    if (error)
        return (
            <p className="text-center text-danger fs-5 mt-5">
                {error}
            </p>
        )

    return (
        <>
            <h4 className="text-center bg-info-subtle fs-5 fw-bold mb-4 p-3 text-primary">
                CATÁLOGO DE CAMIONETAS DISPONIBLES
            </h4>

            <ul className="d-flex flex-wrap justify-content-center text-center gap-4 list-unstyled p-0">
                {camionetas.map((camioneta) => (
                    <li
                        key={camioneta.id}
                        className="card shadow-lg fs-6 border-secondary-subtle bg-info-subtle rounded vehiculo"
                        style={{ width: "300px" }}
                    >
                        <img
                            src={camioneta.imagen}
                            className="card-img-top rounded-4 p-2"
                            alt={camioneta.nombre}
                            style={{ width: "100%", height: "400px", objectFit: "cover" }}
                        />

                        <span className="fw-bold fs-5 mt-2 pb-1">{camioneta.nombre}</span>
                        <span className="fs-6 px-2 pb-1">{camioneta.descripcion}</span>
                        <span className="fw-bold fs-6 pb-1">$ {camioneta.precio}</span>

                        <button
                            className="btn btn-success m-1 rounded fs-6 d-block mx-auto"
                            onClick={() => addToCart(camioneta)}
                        >
                            Agregar al carrito
                        </button>

                        <Link
                            to={`/camionetas/${camioneta.id}/${camioneta.nombre}`}
                            state={{ camioneta }}
                        >
                            <button className="btn text-light bg-primary m-2 fs-6 rounded">
                                Más detalles
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Camionetas

