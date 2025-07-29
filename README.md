# Gestor de Contactos

Una aplicación moderna para gestionar contactos personales con múltiples funcionalidades avanzadas como categorización, búsqueda, ordenamiento, favoritos y persistencia local.

![Gestor de Contactos](./src/assets/ManagerContact-Xandev.png)

## Stack Tecnológico

- **Frontend**: React 19
- **Estilos**: Tailwind CSS 4
- **Bundler/Dev Server**: Vite 7
- **Lenguaje**: JavaScript (ES6+)
- **Linting**: ESLint 9
- **Fetch API**: Para realizar peticiones HTTP a la API externa
- **Variables de Entorno**: Para configuración segura de URLs de API
- **Notificaciones**: Sonner para notificaciones modernas y personalizables

## Instrucciones de Instalación

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)

### Pasos de Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AlexanderG8/contact-manager.git
   cd contact-manager
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## Instrucciones de Uso

### Gestión de Contactos

- **Añadir Contacto**: Completa el formulario con nombre, teléfono, email y categoría, luego haz clic en "Save Contact".
- **Editar Contacto**: Haz clic en el icono de edición (lápiz) en cualquier tarjeta de contacto para modificar sus datos.
- **Eliminar Contacto**: Haz clic en el icono de papelera en cualquier tarjeta de contacto para eliminar el contacto (se mostrará una confirmación).
- **Ver Detalles**: Haz clic en cualquier contacto para ver sus detalles completos en el panel lateral.
- **Marcar Favorito**: Utiliza el icono de estrella para marcar/desmarcar contactos como favoritos.

### Filtros y Búsqueda

- **Búsqueda**: Utiliza el campo de búsqueda para filtrar contactos por nombre, teléfono o email.
- **Filtro por Favoritos**: Activa el interruptor "Show favorites" para mostrar solo los contactos favoritos.
- **Filtro por Categoría**: Selecciona una categoría del desplegable para filtrar contactos.
- **Ordenamiento**: Utiliza el desplegable "Sort by..." para ordenar los contactos por diferentes criterios.

### Respaldo de Datos

- **Respaldo de Datos**: Haz clic en "Export Data" para descargar un archivo JSON con todos tus contactos y configuraciones.
- **Importar**: Haz clic en "Import Data" para cargar un archivo JSON previamente exportado.

### Integración con API Externa

La aplicación implementa el patrón Service Layer para comunicarse con una API externa:

1. **CRUD Completo**: Todas las operaciones (Crear, Leer, Actualizar, Eliminar) están integradas con la API
2. **Capa de Servicio**: El archivo `contactService.js` encapsula toda la lógica de comunicación con la API
3. **Carga Automática**: Al abrir la aplicación, se intenta cargar contactos desde la API configurada en `VITE_API_URL`
4. **Sistema de Fallback**: Si la API no está disponible, se cargan contactos desde localStorage
5. **Contactos de Ejemplo**: Si no hay datos guardados, se muestran contactos predeterminados
6. **Notificaciones**: El sistema muestra notificaciones para cada operación CRUD (éxito, error, advertencia)
7. **Manejo de Errores**: Sistema robusto de manejo de errores con reintentos automáticos

**Configuración de la API:**
- Edita el archivo `.env` en la raíz del proyecto
- Modifica la variable `VITE_API_URL` con la URL de tu API
- La API debe devolver un array de contactos en formato JSON

## Funcionalidades Implementadas

### Funcionalidades Core

- **CRUD Completo**: Crear, leer, actualizar y eliminar contactos con integración a API
- **Patrón Service Layer**: Implementación del patrón de diseño Service Layer para separar la lógica de negocio
- Interfaz de usuario intuitiva y responsive
- Visualización de contactos en tarjetas con información relevante
- Selección de contacto para ver detalles completos
- Confirmación antes de eliminar contactos

### Retos Extra

1. **Búsqueda Inteligente**
   - Búsqueda en tiempo real por nombre, teléfono o email
   - Resaltado visual de los términos de búsqueda en los resultados

2. **Ordenamiento Avanzado**
   - Ordenar alfabéticamente (A-Z o Z-A)
   - Ordenar por favoritos primero
   - Ordenar por fecha de creación (más recientes primero)

3. **Validación Avanzada de Teléfono**
   - Validación de formato de teléfono en tiempo real
   - Soporte para diferentes formatos (espacios, guiones, paréntesis)

### Retos Autónomos

1. **Indicador de Progreso del Formulario**
   - Contador visual de campos completados
   - Barra de progreso que se actualiza en tiempo real

2. **Selección Automática y Sistema de Notificaciones**
   - Selección automática del contacto recién añadido
   - Sistema de notificaciones moderno con Sonner
   - Diferentes tipos de notificaciones según el contexto (éxito, error, información)
   - Personalización de duración y estilo de las notificaciones

3. **Prevención de Contactos Duplicados**
   - Validación para evitar nombres duplicados
   - Mensaje de error específico para contactos duplicados

### Retos Finales

1. **Categorías de Contactos**
   - Asignación de categorías (Trabajo, Personal, Familia)
   - Filtrado por categoría
   - Visualización con código de colores por categoría
   - Contadores de contactos por categoría

2. **Persistencia Local**
   - Almacenamiento automático en localStorage
   - Carga de datos al iniciar la aplicación
   - Exportación e importación de datos
   - Manejo de errores en operaciones de almacenamiento

3. **Modo Edición**
   - Edición de contactos existentes
   - Validación en tiempo real durante la edición
   - Confirmación antes de descartar cambios no guardados
   - Indicador visual del modo edición

## Decisiones Técnicas y Patrones Aplicados

### Patrón Service Layer

Se ha implementado el patrón Service Layer para separar la lógica de negocio de la interfaz de usuario:

- **Encapsulamiento**: Toda la lógica de comunicación con la API está encapsulada en `contactService.js`
- **Operaciones CRUD**: Implementación completa de métodos para crear, leer, actualizar y eliminar contactos
- **Transformación de Datos**: El servicio se encarga de transformar los datos entre el formato de la API y el formato interno
- **Manejo de Errores**: Sistema robusto con reintentos automáticos y logging detallado
- **Estadísticas**: El servicio mantiene estadísticas de uso (peticiones exitosas, fallidas, tiempos de respuesta)
- **Singleton**: Se exporta una única instancia del servicio para mantener el estado

### Arquitectura de Componentes

- **Componentes Funcionales**: Uso exclusivo de componentes funcionales con React Hooks para gestión de estado y efectos secundarios.
- **Prop Drilling Controlado**: Paso de props entre componentes de forma estructurada para mantener un flujo de datos predecible.

### Gestión de Estado

- **useState**: Para gestión de estado local en componentes.
- **useEffect**: Para efectos secundarios como cargar/guardar datos en localStorage.
- **useMemo**: Para optimizar el rendimiento en operaciones costosas como filtrado y ordenamiento.
- **Carga de Datos**: Sistema de prioridades: API → localStorage → datos por defecto

### Servicios y API

- **Patrón Service Layer**: Implementación completa del patrón Service Layer en `/src/services/contactService.js`
- **Operaciones CRUD Completas**: Implementación de Create, Read, Update y Delete integradas con la API
- **Manejo de Errores**: Try-catch comprehensivo con logging detallado y sistema de reintentos
- **Configuración**: Variables de entorno para URLs de API seguras
- **Fallback Automático**: Si la API falla, el sistema guarda los datos localmente
- **Notificaciones Integradas**: Cada operación CRUD muestra notificaciones de éxito o error

### Patrones de Diseño

- **Controlled Components**: Todos los inputs del formulario son componentes controlados.
- **Conditional Rendering**: Renderizado condicional basado en estado para mostrar/ocultar elementos.
- **Lifting State Up**: El estado principal se mantiene en el componente App y se pasa a los componentes hijos.
- **Composition**: Composición de componentes pequeños para crear interfaces más complejas.

### Optimizaciones

- **Memoización**: Uso de useMemo para evitar recálculos innecesarios en filtrado y ordenamiento.
- **Lazy Initialization**: Inicialización perezosa de estado para cargar datos desde localStorage.
- **Batch Updates**: Agrupación de actualizaciones de estado para reducir renderizados.

### Manejo de Errores

- **Try-Catch**: Implementación de bloques try-catch para operaciones propensas a errores.
- **Validación Defensiva**: Comprobación de existencia de datos antes de acceder a propiedades.
- **Feedback Visual**: Sistema de notificaciones con Sonner para informar al usuario sobre errores o acciones exitosas, con diferentes tipos de notificaciones (success, error, info) y personalización de duración.

### Estilizado

- **Utility-First CSS**: Uso de Tailwind CSS para un desarrollo rápido y consistente.
- **Responsive Design**: Diseño adaptable a diferentes tamaños de pantalla.
- **Dark Mode**: Interfaz con tema oscuro para mejor experiencia visual.

### Sistema de Notificaciones

- **Librería Sonner**: Implementación de Sonner para un sistema de notificaciones moderno y elegante.
- **Tipos de Notificaciones**: Soporte para diferentes tipos de notificaciones (success, error, info) con estilos visuales distintos.
- **Personalización**: Configuración de duración, posición y estilo de las notificaciones.
- **Experiencia de Usuario**: Animaciones suaves y diseño moderno para mejorar la experiencia del usuario.
- **Código Limpio**: Eliminación de lógica repetitiva para mostrar/ocultar notificaciones, resultando en un código más mantenible.
