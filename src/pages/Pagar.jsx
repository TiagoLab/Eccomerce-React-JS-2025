import { useLocation, useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"
import { useCartContext } from "../context/CartContext"
import { useEffect } from "react"
import { toast } from "react-toastify"

function Pagar() {

  const { usuario, cerrarSesion } = useAuthContext()
  const { cart, clearCart } = useCartContext()

  const location = useLocation()
  const navigate = useNavigate()

  const total = cart
    .reduce((acc, item) => acc + item.precio * item.quantity, 0)
    .toFixed(2)

  const comprar = () => {
    toast.success("¡Compra realizada con éxito!")
    clearCart()
    navigate("/")
  }

  useEffect(() => {
    if (!usuario) {
      navigate("/iniciar-sesion", { state: { carrito: cart } })
    }
  }, [usuario])

  return (
    <div className="container mt-4">

      <h2 className="text-center fw-bold mb-4">Confirmación de compra</h2>

      <div className="text-center fs-6 mx-auto d-block mb-4">
        <p><strong>Usuario:</strong> {usuario.nombre}</p>
        <p><strong>Email:</strong> {usuario.email}</p>

        <button
          onClick={cerrarSesion}
          className="btn btn-secondary text-center mb-4 rounded fs-6 mx-auto d-block"
        >
          Cerrar sesión
        </button>

        <hr />
      </div>

      <div className="text-center mb-4">
        <h4 className="fw-bold">Total a pagar: $ {total}</h4>
      </div>

      <div className="text-center">
        <button
          onClick={comprar}
          className="btn btn-success fw-bold rounded fs-6 mx-auto d-block"
          style={{ width: "200px" }}
        >
          Confirmar y Pagar
        </button>

        <button
          onClick={() => navigate("/carrito")}
          className="btn btn-secondary mt-3 fw-bold rounded fs-6 mx-auto d-block"
          style={{ width: "200px" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default Pagar
