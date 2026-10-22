import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './components/Cart';
import Contact from './pages/Contact';
import Checkout from './components/Checkout'; // <--- 1. Importa Checkout (o ajusta la ruta si lo pusiste en pages/)
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import { useState, useEffect } from 'react';
import { leerCarrito, guardarCarrito } from './utils/storage';

function App() {
  // 1. Estado del carrito inicializado con lectura perezosa de localStorage
  const [carrito, setCarrito] = useState(() => leerCarrito());

  // 2. useEffect para guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  // 3. Función para agregar (usando spread operator)
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // 4. Función para eliminar (usando filter)
  const eliminarDelCarrito = (indice) => {
    setCarrito(carrito.filter((item, i) => i !== indice));
  };

  // 5. Función para vaciar todo el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // 6. Calcular el total (usando reduce)
  const total = carrito.reduce((acumulador, item) => acumulador + item.precio, 0);

  return (
    <>
      <Navbar 
        cantidadCarrito={carrito.length} 
        agregarAlCarrito={agregarAlCarrito} 
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/productos" element={<Products agregarAlCarrito={agregarAlCarrito} />} />
          
          <Route path="/carrito" element={
            <Cart 
              carrito={carrito} 
              total={total} 
              onEliminar={eliminarDelCarrito}
              onVaciar={vaciarCarrito}
            />
          } />
          
          {/* 2. Agregamos la ruta para el formulario de pago / pedido */}
          <Route path="/checkout" element={
            <Checkout 
              carrito={carrito} 
              total={total} 
              onVaciar={vaciarCarrito} 
            />
          } />
          
          <Route path="/contacto" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;