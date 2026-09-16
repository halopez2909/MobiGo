import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  // por ahora en 0, luego se conecta con el carrito
  const cantidadCarrito = 0

  // temporal: Juan la reemplaza cuando haga el carrito
  const agregarAlCarrito = (producto) => {
    console.log('Agregado al carrito:', producto.nombre)
  }

  return (
    <>
      <Navbar cantidadCarrito={cantidadCarrito} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
