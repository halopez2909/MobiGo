const razones = [
  {
    id: 1,
    titulo: 'Todos tenemos uno',
    texto: 'Usamos el celular para estudiar, trabajar y comunicarnos, y sus accesorios se cambian seguido.',
  },
  {
    id: 2,
    titulo: 'Comprar el que no es',
    texto: 'Muchas veces la funda o el vidrio no le queda al modelo. Queremos que el cliente encuentre lo compatible con su celular.',
  },
  {
    id: 3,
    titulo: 'Aplicar lo visto en clase',
    texto: 'Una tienda nos deja usar componentes, objetos, useState, eventos, formularios y validaciones.',
  },
]

function Motivation() {
  return (
    <section className="section motivation">
      <div className="container motivation-content">
        <h2>¿Por qué elegimos este tema?</h2>

        <div>
          {razones.map((razon) => (
            <div key={razon.id} className="reason">
              <h3>{razon.titulo}</h3>
              <p>{razon.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Motivation
