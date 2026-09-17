import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { useState } from 'react';

function App() {
  // 1. Estado del carrito
  const [carrito, setCarrito] = useState([]);

  // 2. Función para agregar (usando spread operator)
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // 3. Función para eliminar (usando filter)
  const eliminarDelCarrito = (indice) => {
    setCarrito(carrito.filter((item, i) => i !== indice));
  };

  // 4. Calcular el total (usando reduce)
  const total = carrito.reduce((acumulador, item) => acumulador + item.precio, 0);

  return (
    <>
      {/* Pasamos el tamaño del carrito a la prop cantidadCarrito que ya estaba definida */}
      <Navbar cantidadCarrito={carrito.length} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Pasamos la función real para agregar al carrito */}
          <Route path="/productos" element={<Products agregarAlCarrito={agregarAlCarrito} />} />
          
          {/* Le pasamos al Cart el estado, el total y la función para eliminar */}
          <Route path="/carrito" element={
            <Cart 
              carrito={carrito} 
              total={total} 
              onEliminar={eliminarDelCarrito} 
            />
          } />
          
          <Route path="/contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
