import { Link } from 'react-router-dom'

function Servicios() {
  return (
    <div className="container">
      <h1 className="text-center mb-3" style={{ color: "#1565c0" }}>Servicios</h1>
      <hr style={{ borderTop: "3px solid #1565c0", width: "50px", margin: "0 auto 30px" }} />

      <div className="text-primary fs-5" style={{ lineHeight: "1.8" }}>
        <p>
          En <strong>Transfor Motors</strong> trabajamos para ofrecerte una experiencia completa, segura y confiable en la compra y mantenimiento de tu vehículo. 
          Nuestros servicios están diseñados para acompañarte antes, durante y después de tu adquisición.
        </p>

        <ul className="list-group-flush mb-4">
          <li className="list-group-item border-0 ps-0">
            <strong>1. Asesoramiento personalizado:</strong> Te ayudamos a elegir el vehículo que mejor se adapte a tus necesidades, presupuesto y estilo de vida.
          </li>

          <li className="list-group-item border-0 ps-0">
            <strong>2. Revisión técnica y certificación:</strong> Cada vehículo es inspeccionado rigurosamente para garantizar su funcionamiento, seguridad y calidad.
          </li>

          <li className="list-group-item border-0 ps-0">
            <strong>3. Financiamiento flexible:</strong> Ofrecemos planes de pago accesibles y opciones de financiación adaptadas a cada cliente.
          </li>

          <li className="list-group-item border-0 ps-0">
            <strong>4. Servicio post‑venta:</strong> Te acompañamos después de la compra con soporte, mantenimiento y atención personalizada.
          </li>

          <li className="list-group-item border-0 ps-0">
            <strong>5. Garantía y soporte técnico:</strong> Brindamos garantía en todos nuestros vehículos y asistencia técnica especializada.
          </li>
        </ul>

        <p>
          En <strong>Transfor Motors</strong> creemos que elegir un vehículo es una decisión importante. 
          Por eso, nuestro compromiso es brindarte confianza, transparencia y un servicio de excelencia.
        </p>
      </div>

      <div className="text-center mt-4">
        <Link to="/">
          <button
            className="btn btn-primary fw-bold px-4 py-2"
            style={{ backgroundColor: "#1565c0", borderColor: "#0d47a1" }}
          >
            Volver al Inicio
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Servicios
