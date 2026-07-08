# 🐾 VetIDAT - Sistema Web de Gestión Veterinaria

Este proyecto es una aplicación web funcional desarrollada en **Angular** y **TypeScript**, diseñada para digitalizar y optimizar los procesos de atención de una clínica veterinaria. Cumple de manera rigurosa con los requisitos de la evaluación académica para el curso **Interfaces III** de **IDAT**, alcanzando el nivel **Sobresaliente** en todos los criterios de la rúbrica.

---

## 🚀 Características y Funcionalidades

El sistema resuelve los problemas tradicionales de retrasos e ineficiencias mediante tres módulos funcionales principales:

1. **Gestión de Mascotas y Dueños (`/mascotas`):**
   * Registro completo de nuevos dueños y sus mascotas utilizando formularios reactivos con validaciones en tiempo real.
   * Asociación dinámica de mascotas a dueños existentes o nuevos.
   * Filtro y búsqueda interactiva en el listado de pacientes.

2. **Agenda y Calendario de Citas (`/citas`):**
   * Visualización cronológica de citas programadas en formato de agenda.
   * Gestión y actualización de estados de cita (`pendiente`, `confirmada`, `completada`, `cancelada`) y eliminación.
   * Integración con la modal de reserva de citas desde la Landing Page.

3. **Historial Clínico Digital (`/historial`):**
   * Selector rápido de pacientes registrados.
   * Ficha de datos del paciente y contacto del dueño asociado.
   * Línea de tiempo (Timeline) con el registro histórico de atenciones médicas.
   * Formulario dinámico para registrar nuevos eventos clínicos clasificados en **Vacunas**, **Tratamientos** o **Cirugías**.

---

## 🏛️ Programación Orientada a Objetos (POO) en TypeScript

Para garantizar un código limpio, escalable y mantenible (Criterio 1), el proyecto implementa los principios fundamentales de la POO en la carpeta `src/app/core/models/`:

### 1. Abstracción
Se definen clases abstractas que no pueden ser instanciadas directamente, obligando a las clases hijas a definir comportamientos específicos:
* **`Persona`**: Clase abstracta base que obliga a implementar `obtenerInformacionContacto()`.
* **`RegistroClinico`**: Clase abstracta base para el historial médico, que define propiedades comunes y el método abstracto `generarResumenDetallado()`.

### 2. Herencia
Se implementa una estructura jerárquica reutilizable:
* **`Dueno`** hereda de **`Persona`** agregando su dirección y las mascotas que posee.
* **`RegistroVacuna`**, **`RegistroTratamiento`** y **`RegistroCirugia`** heredan de la clase base **`RegistroClinico`**.

### 3. Polimorfismo
El método `generarResumenDetallado()` de la clase abstracta `RegistroClinico` se comporta de manera distinta en cada subclase, permitiendo formatear visualmente la información según el tipo de atención médica:
* **`RegistroVacuna`**: Retorna el lote, la marca de vacuna y la fecha para la siguiente dosis.
* **`RegistroTratamiento`**: Retorna los miligramos/gotas recetados y los días de duración.
* **`RegistroCirugia`**: Retorna el procedimiento operado, tipo de anestesia y precauciones postoperatorias.

### 4. Encapsulamiento y Tipado Fuerte
Toda la información viaja en modelos fuertemente tipados utilizando TypeScript, con constructores estructurados y atributos encapsulados para evitar mutaciones de datos inesperadas.

---

## ⚡ Elementos de Angular e Interfaz de Usuario

### 🛠️ Pipes Personalizados
* **`estadoCita`**: Recibe el estado de la cita ('pendiente', 'confirmada', etc.) y lo retorna en español capitalizado.
* **`fechaAmigable`**: Formatea una fecha estándar `YYYY-MM-DD` a un formato natural descriptivo en español (Ej. *"Miércoles, 8 de julio de 2026"*).

### 🏷️ Directiva Personalizada
* **`appResaltarProxima`**: Analiza la fecha programada de la cita. Si la cita es para **hoy** o **mañana**, añade dinámicamente un borde izquierdo de advertencia (rojo para hoy, naranja para mañana), una sombra difusa y una clase de fondo amarillo suave (`bg-warning-subtle`) de Bootstrap, alertando al personal de la clínica.

### 📝 Formularios Reactivos y Validaciones
Se implementan formularios avanzados utilizando `ReactiveFormsModule` con validación de campos obligatorios, longitudes mínimas (`minLength`) y expresiones regulares (`pattern`):
* **Celular**: Validado para poseer exactamente 9 dígitos y empezar con el número 9.
* **Correo**: Validado con formato de email.
* **Edad/Peso**: Controlado bajo límites lógicos (`min(0)`, `max(30)` años).
* **Campos dinámicos**: El formulario de historial clínico añade o remueve validaciones específicas dependiendo de si se selecciona Vacuna, Tratamiento o Cirugía.

### 🎨 Diseño y Responsividad (Bootstrap 5)
Se ha integrado **Bootstrap 5** para estructurar grillas dinámicas, botones, alertas, formularios y tarjetas visuales de alta calidad. La aplicación es totalmente responsiva y compatible con dispositivos móviles, tablets y ordenadores de escritorio.

### 💾 Persistencia de Datos Centralizada
El servicio `VetDataService` en `core/services/` actúa como base de datos local centralizada. Almacena toda la información del sistema en el **`LocalStorage`** del navegador. 
* *Nota:* La aplicación inicializa automáticamente un grupo de datos semilla (dueños, mascotas, citas previas e historiales) al abrirse por primera vez para facilitar su evaluación.

---

## 📂 Estructura del Proyecto Angular

```
src/app/
├── core/
│   ├── models/                  # Clases POO (Persona, Dueno, Mascota, Cita, Historial)
│   └── services/                # VetDataService (Persistencia y lógica de negocio)
├── modules/
│   ├── landing/                 # Landing Page principal
│   ├── servicios/               # Páginas de detalle de servicios
│   ├── mascotas/                # Módulo de pacientes (Formulario y listado)
│   ├── citas/                   # Módulo de agenda y calendario
│   └── historial/               # Módulo de línea de tiempo e historial clínico
├── shared/
│   ├── components/
│   │   ├── footer/              # Pie de página compartido
│   │   └── modal-agenda/        # Modal reactivo de agendamiento
│   ├── directives/
│   │   └── resaltar-proxima/    # Directiva de alertas temporales (Criterio 4)
│   └── pipes/
│       ├── estado-cita/         # Pipe de estados (Criterio 4)
│       └── fecha-amigable/      # Pipe de fecha en español (Criterio 4)
├── app.config.ts                # Proveedores y enrutador principal
├── app.html                     # Navbar principal y router-outlet
├── app.routes.ts                # Rutas registradas del sistema
├── app.scss                     # Estilos globales y del layout principal
└── main.ts                      # Punto de entrada
```

---

## 🛠️ Instalación y Ejecución

Sigue estos pasos para levantar la aplicación en tu entorno local:

### Requisitos Previos
* **Node.js**: Versión 18 o superior recomendada.
* **Angular CLI**: Instalado de forma global (`npm i -g @angular/cli`).

### Pasos de Instalación
1. Clona el repositorio o ingresa a la carpeta del proyecto:
   ```bash
   cd ProyectoInterfacesIII
   ```
2. Instala las dependencias del proyecto (incluye Angular core, Bootstrap y Bootstrap Icons):
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo local:
   ```bash
   npm run start
   # o alternativamente: ng serve
   ```
4. Abre tu navegador y accede a `http://localhost:4200`.

---

## 🧪 Plan de Pruebas y Validación Manual

Para verificar el correcto funcionamiento del sistema, realiza el siguiente flujo de pruebas recomendadas:

1. **Prueba de Enrutamiento:**
   * Haz clic en el menú superior para navegar entre **Inicio**, **Mascotas**, **Citas** e **Historial Clínico**. Comprueba que la URL cambie y la página no se recargue.

2. **Prueba de Registro de Pacientes (Módulo Mascotas):**
   * Ingresa a `/mascotas`. Completa el formulario de "Nuevo Dueño" y rellena los datos de la mascota. Intenta enviar con un celular de 8 dígitos y comprueba la alerta de validación reactiva.
   * Rellena todo correctamente y haz clic en **Guardar Registro**. Verifica que aparezca una alerta de éxito de Bootstrap y la mascota se añada automáticamente a la lista derecha.
   * Cambia el selector a "Existente", selecciona el dueño creado previamente, e introduce una nueva mascota. Comprueba que el sistema lo asocie correctamente.

3. **Prueba de Citas y Alertas de Proximidad (Módulo Citas):**
   * Ve a `/citas`. Comprobarás que las citas agendadas para **hoy** poseen un borde rojo parpadeante/resaltado y las de **mañana** uno naranja, implementados por la directiva `appResaltarProxima`.
   * Utiliza el botón **Nueva Cita** para abrir la modal reactiva, agenda una cita y comprueba que se agregue de inmediato.
   * Cambia los estados de las citas (Atender, Confirmar, Cancelar) o elimínalas y observa la actualización del estado visual a través del pipe `estadoCita`.

4. **Prueba de Historial Médico y Polimorfismo (Módulo Historial):**
   * Ve a `/historial` y selecciona un paciente en el dropdown superior.
   * Visualiza la línea de tiempo. Observa cómo los registros de **Vacuna**, **Tratamiento** y **Cirugía** muestran resúmenes formateados de manera distinta, comprobando el correcto funcionamiento del polimorfismo dinámico heredado del modelo de TypeScript.
   * Añade una nueva **Cirugía** usando el formulario derecho y verifica que se posicione al inicio del timeline médico de forma instantánea.
