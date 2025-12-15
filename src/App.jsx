import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Carrito from './pages/Carrito'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Servicios from './pages/Servicios'
import Autos from './pages/Autos'
import DetalleAuto from './pages/DetalleAuto'
import DetalleCamioneta from './pages/DetalleCamioneta'
import Pagar from './pages/Pagar'
import RutaProtegida from './pages/RutaProtegida'
import IniciarSesion from './pages/IniciarSesion'
import Camionetas from './pages/Camionetas'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Dashboard from './pages/Dashboard'
import { AutosProvider } from './context/AutosContext'
import EliminarAutos from './components/EliminarAutos'
import FormularioAutos from './components/FormularioAutos'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <AutosProvider>
            <ToastContainer
              autoClose={2500}
              theme="colored"
              position="top-right"
            />
            <Routes>
              <Route element={<Layout />}>
                <Route path='/' element={<Inicio />} />
                <Route path='/servicios' element={<Servicios />} />

                {/* Catálogo principal */}
                <Route path='/autos' element={<Autos />} />
                <Route path='/camionetas' element={<Camionetas />} />

                {/* Detalles */}
                <Route path='/autos/:id/:nombre' element={<DetalleAuto />} />
                <Route path='/camionetas/:id/:nombre' element={<DetalleCamioneta />} />

                {/* Carrito y pagos */}
                <Route path='/carrito' element={<Carrito />} />
                <Route path='/pagar' element={
                  <RutaProtegida>
                    <Pagar />
                  </RutaProtegida>
                } />

                {/* Autenticación */}
                <Route path='/iniciar-sesion' element={<IniciarSesion />} />

                {/* Admin */}
                <Route path='/dashboard' element={
                  <RutaProtegida soloAdmin={true}>
                    <Dashboard />
                  </RutaProtegida>
                } />

                <Route path='/eliminar-autos' element={
                  <RutaProtegida soloAdmin={true}>
                    <EliminarAutos />
                  </RutaProtegida>
                } />

                <Route path='/formulario-autos' element={
                  <RutaProtegida>
                    <FormularioAutos />
                  </RutaProtegida>
                } />

                {/* Ruta por defecto */}
                <Route path='*' element={<Navigate to='/' replace />} />
              </Route>
            </Routes>
          </AutosProvider>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App
