# Administrador de Contactos

Una aplicación simple para gestionar contactos construida con React y Vite.

## Requisitos Previos

Antes de ejecutar esta aplicación, asegúrate de tener:

- Node.js (v14 o superior) instalado
- npm (Gestor de Paquetes de Node) instalado
- Vite (v4 o superior) instalado

## Instalación

1. Clona este repositorio.
2. Navega al directorio del proyecto.
3. Instala las dependencias utilizando npm:

   ```bash
   npm install
   ```

## Uso

1. Ejecuta la aplicación en modo desarrollo:

   ```bash
   npm run dev
   ```

2. Abre tu navegador y visita en link que te facilita al ejecutar el comando.

## Estructura del Proyecto

- `src/`: Contiene el código fuente de la aplicación.
  - `components/`: Componentes reutilizables.
  - `App.jsx`: Componente principal de la aplicación.
  - `index.jsx`: Punto de entrada de la aplicación.

## Reflexión

### ¿Qué diferencia hay entre state y props?

Las principales diferencias entre state y props son:

- **Props (propiedades)**:
  - Son inmutables (read-only)
  - Se pasan de componente padre a hijo
  - Los cambios vienen desde fuera del componente
  - Se usan para configurar un componente

- **State (estado)**:
  - Es mutable y puede cambiar
  - Es privado y controlado por el componente
  - Los cambios pueden hacerse dentro del componente
  - Se usa para datos que cambian con el tiempo

Por ejemplo, si tenemos un componente Contador, el valor inicial podría venir como prop, pero el valor actual se mantendría en el state ya que cambia con cada clic.


### ¿Qué pasa cuando cambias un state?

Cuando se modifica un state en React, ocurren varios procesos:

1. **Re-renderizado**: React vuelve a renderizar el componente donde se cambió el state.

2. **Proceso por lotes**: React agrupa múltiples actualizaciones de state para optimizar el rendimiento.

3. **Actualización asíncrona**: Los cambios de state son asíncronos, no son inmediatos.

4. **Propagación**: Si el componente tiene hijos, estos también se pueden re-renderizar si:
   - Reciben props del componente padre
   - Usan el mismo estado a través de un contexto

5. **Preservación del DOM**: React usa un Virtual DOM para minimizar las actualizaciones reales del DOM.

Por ejemplo:
```jsx
// Componente Padre
function Padre() {
  const [contador, setContador] = useState(0);

  function incrementarContador() {
    setContador(contador + 1);
  }

  return (
    <div>
      <h1>Contador: {contador}</h1> // Renderiza el valor del state
      <Hijo contador={contador} /> // Pasa el state como prop al componente hijo
      <button onClick={incrementarContador}>Incrementar</button>
    </div>
  )
}
// Componente Hijo
function Hijo(props) {
  return (
    <div>
      <h2>Contador del Padre: {props.contador}</h2> // Recibe el state como prop
    </div>
  )
}
```

Al hacer clic en el botón "Incrementar", el componente Padre re-renderiza,y el componente Hijo también se re-renderiza porque recibe la prop actualizada.

### ¿Cómo se comunican los componentes?

En React, los componentes pueden comunicarse de varias formas:

1. **Props (Padre a Hijo)**:
   - La forma más directa de comunicación
   - El padre pasa datos al hijo a través de props
   ```jsx
   function Padre() {
     return <Hijo mensaje="Hola desde el padre" />
   }
   ```

2. **Callbacks (Hijo a Padre)**:
   - El padre pasa una función como prop al hijo
   - El hijo llama a esta función para comunicarse con el padre
   ```jsx
   function Padre() {
     const handleClick = (datos) => console.log(datos);
     return <Hijo onAction={handleClick} />
   }
   ```

3. **Context API (Comunicación Global)**:
   - Permite compartir datos sin pasar props manualmente
   - Útil para datos que necesitan muchos componentes
   ```jsx
   const MiContexto = React.createContext();
   function App() {
     return (
       <MiContexto.Provider value={datos}>
         <Componentes/>
       </MiContexto.Provider>
     )
   }
   ```

4. **State Management (Redux, Zustand, etc.)**:
   - Para aplicaciones más complejas
   - Gestión centralizada del estado
   - Comunicación entre cualquier componente

5. **Event Bus/Pub-Sub**:
   - Para comunicación entre componentes no relacionados
   - Menos común en React moderno
