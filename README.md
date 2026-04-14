# Jardín de Sentimientos

Aplicación web interactiva para apoyar la autorregulación emocional de estudiantes en contextos académicos. El proyecto propone actividades breves, visuales y guiadas para que el usuario pueda identificar cómo se siente, realizar una pausa, organizar pensamientos y guardar un registro personal de sus actividades.

El proyecto está construido con tecnologías web puras: **HTML, CSS y JavaScript**, integradas con **Firebase** para autenticación, base de datos y almacenamiento de imágenes.

## Propósito del proyecto

`Jardín de Sentimientos` no busca diagnosticar ni sustituir el acompañamiento profesional. Su objetivo es ofrecer un espacio digital amable, visual y accesible para que el usuario pueda detenerse, reconocer su estado emocional y elegir una actividad acorde a lo que está sintiendo.

La aplicación está orientada principalmente a situaciones relacionadas con carga académica, cansancio, ansiedad, dificultad de concentración, saturación mental y falta de claridad para identificar el propio estado emocional.

## Tecnologías utilizadas

- **HTML5**: estructura de las pantallas, formularios, contenedores y vistas principales.
- **CSS3**: estilos globales, diseño responsivo, tema claro, tema oscuro, componentes reutilizables y adaptación a móvil, tablet y escritorio.
- **JavaScript puro con módulos ES**: lógica de navegación, actividades, formularios, canvas, manejo de estado y conexión con servicios.
- **Firebase Authentication**: registro, inicio de sesión y cierre de sesión de usuarios.
- **Firebase Realtime Database**: almacenamiento de datos de usuario y registros de actividades.
- **Firebase Storage**: almacenamiento de imágenes de perfil y capturas de actividades.
- **Canvas API**: dibujo e interacción visual en actividades como tablero, pizarrón y juego.
- **Font Awesome**: iconos de apoyo visual en botones, navegación y herramientas.
- **localStorage**: preferencias locales del navegador, como tema y sonido seleccionado.

No se utiliza un framework como React, Vue o Angular. Tampoco hay un proceso de compilación con npm. Es una aplicación web estática modularizada.

## Funcionalidades principales

- Registro e inicio de sesión con Firebase Authentication.
- Aceptación de términos y condiciones antes del registro.
- Registro con foto de perfil opcional.
- Uso automático de una imagen predeterminada cuando el usuario no sube foto.
- Validación visual dentro de formularios, sin depender de alertas del navegador.
- Pantalla de inicio con opciones emocionales fáciles de reconocer.
- Evaluación rápida para usuarios que no saben cómo se sienten.
- Actividades interactivas basadas en canvas y formularios guiados.
- Tutorial breve al entrar a cada actividad.
- Guardado de actividades como imagen en Firebase Storage.
- Registro de respuestas y metadatos en Firebase Realtime Database.
- Bitácora personal con galería de actividades agrupadas por fecha.
- Vista ampliada de cada actividad guardada con sus detalles.
- Descarga de imágenes desde la bitácora.
- Preferencias locales de tema visual y sonido ambiental.
- Tema claro y tema oscuro.
- Diseño responsivo para móvil, tablet y escritorio.

## Flujo general de usuario

1. El usuario entra a la aplicación.
2. Inicia sesión o se registra.
3. Si se registra, primero acepta términos y condiciones.
4. Si no sube foto, se asigna una imagen de perfil predeterminada.
5. Entra a la pantalla de inicio.
6. Selecciona la opción que más se parece a cómo se siente.
7. La aplicación abre una actividad relacionada.
8. La actividad muestra una guía breve de uso.
9. El usuario realiza la actividad.
10. Al finalizar correctamente, responde cómo se siente ahora.
11. Puede agregar un comentario opcional.
12. La aplicación guarda la imagen en Firebase Storage.
13. La aplicación guarda los datos de la actividad en Realtime Database.
14. La actividad aparece en la bitácora personal.

## Pantallas principales

### Inicio

La pantalla de inicio pregunta al usuario:

```text
¿Cómo te sientes hoy?
```

Las opciones están redactadas en lenguaje cercano al usuario, no como nombres técnicos de instrumentos psicológicos. Cada botón tiene un icono y un tono visual relacionado con la emoción o necesidad que representa.

Opciones principales:

- **No sé cómo me siento**: abre una evaluación rápida.
- **Me siento saturado mentalmente**: abre el tablero de notas.
- **No me puedo concentrar**: abre el pizarrón creativo.
- **Me siento agotado**: abre la respiración guiada.
- **Me siento ansioso**: abre el juego de la flor.

### Perfil

Muestra la información del usuario y sus preferencias de uso.

Incluye:

- Foto de perfil.
- Nombre.
- Correo.
- Programa académico.
- Semestre.
- Preferencias de tema.
- Preferencias de sonido para actividades.

Las preferencias de tema y sonido se guardan de forma local en el navegador. No forman parte de los datos principales del usuario en Firebase.

### Bitácora

Muestra las actividades guardadas por el usuario. Las actividades se agrupan por fecha y se presentan como una galería visual.

Al seleccionar una imagen, se abre una vista ampliada con:

- Imagen de la actividad.
- Nombre de la actividad.
- Fecha.
- Hora.
- Respuesta final del usuario.
- Comentario opcional.
- Datos extra, cuando la actividad los genera.
- Opción para descargar la imagen.

Si el usuario todavía no tiene actividades guardadas, la bitácora muestra un estado vacío amable en lugar de dejar la página en blanco.

## Actividades disponibles

### Tablero de notas

Actividad pensada para usuarios que se sienten saturados mentalmente, con muchas tareas pendientes o con poco tiempo para organizarse.

Permite crear hasta tres notas visuales tipo post-it. Cada nota puede:

- Moverse dentro del lienzo.
- Cambiar de tamaño.
- Editarse.
- Eliminarse.
- Recibir una prioridad.

Las prioridades disponibles son:

- **Alta**: rojo.
- **Media**: amarillo.
- **Baja**: verde.

Cada prioridad solo puede usarse una vez. Esto ayuda a que el usuario organice lo que tiene en mente y distinga qué requiere atención inmediata, qué puede esperar y qué es menos urgente.

El formulario guiado de cada nota pregunta:

- ¿Qué tienes en mente?
- ¿Está en tus manos hacer algo ahora?
- Si la respuesta es sí: ¿qué puedes hacer ya?
- Si la respuesta es no: ¿cómo te hace sentir?

La intención es ayudar a transformar preocupaciones en ideas más concretas, sin obligar al usuario a escribir párrafos largos. Por eso se usan límites breves de palabras para mantener las notas legibles dentro del lienzo.

La actividad solo permite guardar cuando existe contenido en el tablero. Si el usuario presiona `Terminar`, sale sin guardar.

### Riega tu calma

Juego 2D tipo arcade inspirado en Space Invaders, pero con un enfoque emocional, relajante y no violento.

El usuario controla una manguera y lanza gotas de agua para disolver pensamientos negativos antes de que alcancen la flor. La flor representa el estado emocional del usuario y crece progresivamente durante la partida.

Elementos del juego:

- Flor con etapas de crecimiento.
- Manguera controlada por cursor, toque o movimiento.
- Gotas de agua.
- Pensamientos negativos como enemigos.
- Sol y elementos naturales decorativos.
- Indicador de tiempo.
- Indicador de cuidado o vida de la flor.

Los enemigos representan situaciones asociadas al estrés académico, por ejemplo:

- Falta de tiempo.
- Autoexigencia.
- Perfeccionismo.
- Frustración.
- Tesis.
- Sobrecarga académica.
- Inseguridad.
- Desmotivación.

Antes de iniciar, el usuario ve una guía y elige la duración de la partida:

- 30 segundos.
- 1 minuto.
- 1 minuto y 30 segundos.

El juego inicia hasta que el usuario confirma la duración. Si presiona `Terminar`, sale de la actividad sin guardar. La actividad solo se guarda cuando la partida termina por completo, ya sea porque el usuario completa el tiempo o porque la flor necesita una pausa.

### Respiración guiada

Actividad para usuarios que se sienten agotados o necesitan una pausa breve.

La pantalla muestra un círculo animado que acompaña fases de respiración:

- Inhala.
- Sostén.
- Exhala.

El usuario debe presionar `Iniciar` para comenzar. Cada sesión dura aproximadamente un minuto. Al terminar cada minuto, la aplicación pregunta:

```text
¿Cómo te sientes ahora?
```

Opciones:

- Estoy más tranquilo.
- Necesito respirar otra vez.

Si el usuario necesita respirar otra vez, inicia otra sesión de un minuto. El proceso puede repetirse hasta que el usuario indique que se siente más tranquilo. Al finalizar, la actividad guarda cuántas sesiones realizó.

### Pizarrón creativo

Actividad orientada a usuarios que tienen dificultad para concentrarse o necesitan expresar visualmente lo que sienten.

Incluye herramientas sencillas:

- Pincel.
- Línea.
- Círculo.
- Cuadrado.
- Triángulo.
- Mover elementos.
- Cambiar color de línea.
- Cambiar color de relleno.
- Cambiar grosor.
- Cambiar color de fondo.
- Subir imágenes.

El pizarrón incluye un mensaje de apoyo para recordar al usuario que no necesita saber dibujar. La actividad busca expresión visual, no calidad artística.

La actividad solo permite guardar cuando el usuario ha dibujado, agregado una figura o colocado una imagen. Si presiona `Terminar`, sale sin guardar.

## Evaluación rápida

Cuando el usuario selecciona `No sé cómo me siento`, la aplicación muestra una evaluación breve del 1 al 5.

Las preguntas permiten explorar sensaciones como:

- Abrumamiento.
- Dificultad para concentrarse.
- Cansancio.
- Inquietud.
- Falta de tiempo.
- Dificultad para ordenar ideas.

Con base en las respuestas, la aplicación sugiere una actividad relacionada. Esta evaluación no tiene intención diagnóstica; solo funciona como apoyo para orientar al usuario hacia una actividad inicial.

## Evaluación final de actividades

Al terminar una actividad que sí debe guardarse, la aplicación muestra una evaluación breve para saber cómo se siente el usuario después de realizarla.

La evaluación permite guardar:

- Respuesta final.
- Comentario opcional.
- Fecha y hora.
- Imagen generada por la actividad.
- Datos adicionales si la actividad los produce.

Esta información se muestra después en la bitácora.

## Guardado de información

La aplicación utiliza Firebase para autenticación, base de datos y almacenamiento.

### Firebase Authentication

Gestiona:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Identificación del usuario activo mediante `uid`.

### Firebase Storage

Guarda imágenes de perfil y capturas de actividades.

Estructura para actividades:

```text
usuarios/{uid}/actividades/{nombreActividad}_{fecha}_{hora}.jpg
```

Ejemplo:

```text
usuarios/abc123/actividades/tablero_2026-04-12_18-35-20.jpg
```

En Firebase Storage no es necesario crear manualmente la carpeta. Cuando se sube un archivo a una ruta nueva, Firebase muestra esa ruta como carpeta.

### Firebase Realtime Database

Guarda datos del usuario y registros de actividades.

Estructura general:

```text
usuarios/{uid}
usuarios/{uid}/actividades/{idActividad}
```

Ejemplo de registro de actividad:

```json
{
  "uid": "abc123",
  "nombreActividad": "tablero",
  "respuesta": "Más tranquilo",
  "comentario": "Me ayudó a ordenar mis pendientes",
  "fecha": "2026-04-12",
  "hora": "18:35:20",
  "imagenPath": "usuarios/abc123/actividades/tablero_2026-04-12_18-35-20.jpg",
  "imagenUrl": "https://...",
  "creadoEn": 1776040520000
}
```

En el caso de respiración guiada, también se pueden guardar datos como:

```json
{
  "sesiones": 2,
  "duracionTotalSegundos": 120
}
```

## Preferencias locales

Las preferencias de tema y sonido no se guardan en Firebase. Se almacenan en el navegador con `localStorage`.

Esto permite que cada dispositivo conserve su propia configuración sin modificar los datos personales del usuario en la base de datos.

Preferencias actuales:

- Tema claro u oscuro.
- Sonido ambiental para actividades.

Los audios están pensados para ubicarse en:

```text
recursos/audio/
```

Ejemplos:

```text
bosque.mp3
lluvia.mp3
olas.mp3
silencio.mp3
```

## Estructura del proyecto

```text
Jardin-de-sentimientos/
├── app.js
├── index.html
├── README.md
├── jsconfig.json
├── componentes/
├── estilos/
├── modulos/
├── nucleo/
├── recursos/
├── servicios/
└── utilidades/
```

### Carpetas principales

- `componentes/`: componentes reutilizables de interfaz, como evaluación, menú, términos, tutoriales y canvas.
- `estilos/`: estilos globales, variables, layout base, temas y componentes visuales compartidos.
- `modulos/`: pantallas y actividades principales de la aplicación.
- `nucleo/`: coordinación general de pantallas, estado de sesión y contenedores DOM.
- `recursos/`: imágenes, iconos, audios y recursos generales.
- `servicios/`: integración con Firebase, autenticación, base de datos, almacenamiento, audio y preferencias.
- `utilidades/`: helpers, modelos y funciones reutilizables.

## Módulos principales

```text
modulos/
├── actividades/
│   ├── ansioso/
│   ├── cansado/
│   ├── pizarron/
│   └── tablero/
├── bitacora/
├── inicio/
├── perfil/
└── sesion/
```

### `modulos/inicio`

Construye la pantalla principal, muestra las opciones emocionales y decide qué actividad abrir según la selección del usuario.

### `modulos/actividades`

Contiene las actividades interactivas:

- Tablero de notas.
- Juego de flores.
- Respiración guiada.
- Pizarrón creativo.

### `modulos/bitacora`

Muestra la galería de actividades guardadas. Permite abrir el detalle de una actividad y descargar su imagen.

### `modulos/perfil`

Muestra información del usuario y preferencias locales como tema y sonido.

### `modulos/sesion`

Contiene las pantallas de inicio de sesión, registro, términos y lógica relacionada con el acceso del usuario.

## Estilos

La aplicación usa CSS modularizado.

```text
estilos/
├── estilo.css
├── base/
│   ├── variables.css
│   ├── reset.css
│   ├── layout_base.css
│   ├── componentes.css
│   ├── modulos.css
│   └── utilidades.css
└── componentes/
    ├── botones.css
    ├── formularios.css
    ├── menu_flotante.css
    └── tarjetas.css
```

El archivo principal es:

```text
estilos/estilo.css
```

Desde ahí se importan estilos base, componentes y módulos.

El diseño visual busca mantener:

- Tipografía unificada.
- Botones consistentes.
- Colores coherentes entre tema claro y oscuro.
- Contraste suficiente en textos y acciones.
- Contenedores amplios en escritorio.
- Tamaños controlados en móvil para evitar deformaciones.

## Diseño responsivo

La aplicación está pensada para funcionar en:

- Móviles.
- Tabletas.
- Escritorio.

En móviles y tabletas, la navegación se mantiene en la parte superior. En pantallas grandes, el menú se transforma en navegación lateral para aprovechar mejor el espacio.

La aplicación define un ancho mínimo para evitar que los textos, botones y canvas se deformen en pantallas muy pequeñas.

## Seguridad, validación y estabilidad

El proyecto incluye varias medidas para mejorar la estabilidad:

- Validación visual en formularios.
- Mensajes de error dentro de la interfaz.
- Eliminación de `alert()` para errores principales.
- Construcción segura de elementos de bitácora sin insertar directamente datos externos como HTML.
- Limpieza de estados temporales al salir de actividades.
- Prevención de recarga accidental durante actividades activas.
- Limpieza de listeners y overlays al cambiar de pantalla.
- Botones de guardado deshabilitados cuando no hay contenido válido.
- Salida de actividades sin guardar cuando el usuario presiona `Terminar`.

## Limpieza de actividades

Cuando el usuario sale de una actividad, la aplicación limpia los datos temporales de esa actividad.

Esto evita que una actividad no guardada reaparezca después de navegar, cerrar sesión o recargar la página.

Si el usuario intenta cambiar de sección durante una actividad, la aplicación puede mostrar una confirmación indicando que los datos no guardados se perderán.

## Requisitos

No se requiere instalar dependencias con `npm`.

La aplicación necesita:

- Navegador moderno con soporte para módulos ES.
- Conexión a internet para cargar Firebase y Font Awesome desde CDN.
- Servidor local para evitar problemas con módulos, rutas y recursos.
- Proyecto de Firebase configurado con Authentication, Realtime Database y Storage.

## Cómo ejecutar el proyecto

Opción recomendada con Visual Studio Code:

1. Abrir la carpeta del proyecto.
2. Instalar la extensión `Live Server`.
3. Abrir `index.html`.
4. Ejecutar `Open with Live Server`.

La URL local suele ser:

```text
http://127.0.0.1:5500/
```

También puede usarse cualquier servidor estático local.

Ejemplo con Python:

```bash
python -m http.server 5500
```

Después abrir:

```text
http://localhost:5500/
```

## Configuración de Firebase

La configuración se encuentra en:

```text
servicios/firebase_config.js
```

Ese archivo inicializa:

- Firebase App.
- Firebase Authentication.
- Firebase Realtime Database.
- Firebase Storage.

Para usar otro proyecto de Firebase, se deben reemplazar las credenciales dentro de ese archivo.

También es necesario revisar las reglas de seguridad de Firebase para que solo el usuario autenticado pueda leer y escribir sus propios datos.

## Recursos visuales y de audio

Los recursos generales se ubican en:

```text
recursos/
```

Los recursos específicos del juego de flores se ubican en:

```text
modulos/actividades/ansioso/recursos/
```

Incluyen:

- Flor por etapas.
- Enemigos.
- Manguera.
- Sol.
- Pasto decorativo.

Los sonidos de actividades se ubican en:

```text
recursos/audio/
```

## Pruebas manuales recomendadas

Antes de presentar o entregar el proyecto, conviene revisar:

- Registro con foto de perfil.
- Registro sin foto de perfil.
- Inicio de sesión.
- Cierre de sesión.
- Tema claro y tema oscuro.
- Cambio de sonido en perfil.
- Guardado de tablero con notas.
- Intento de guardar tablero vacío.
- Guardado de pizarrón con dibujo.
- Intento de guardar pizarrón vacío.
- Juego completado.
- Juego finalizado antes de terminar.
- Respiración con una sesión.
- Respiración con más de una sesión.
- Visualización de actividades en bitácora.
- Apertura del detalle de una actividad.
- Descarga de imagen desde bitácora.
- Uso en móvil.
- Uso en tablet.
- Uso en escritorio.

## Estado actual

El proyecto cuenta con:

- Sistema de autenticación funcional.
- Registro con foto opcional.
- Imagen de perfil predeterminada.
- Actividades interactivas implementadas.
- Guardado en Firebase Storage.
- Registro de actividades en Realtime Database.
- Bitácora con galería agrupada por fecha.
- Diseño responsivo.
- Tema claro y oscuro.
- Preferencias locales.
- Guías de uso por actividad.
- Evaluación final con comentario opcional.

## Posibles mejoras futuras

- Filtrar actividades en la bitácora por tipo o fecha.
- Agregar más sonidos ambientales.
- Agregar indicadores de progreso emocional a partir de respuestas guardadas.
- Mejorar navegación por teclado en actividades basadas en canvas.
- Agregar exportación de reportes para análisis académico.
- Agregar más actividades relacionadas con estrés académico.
- Integrar estadísticas visuales en la bitácora.

## Nota importante

Esta aplicación es una herramienta de apoyo emocional y organización personal. No realiza diagnósticos clínicos ni reemplaza la atención psicológica, médica o académica especializada. Si una persona se siente en riesgo, en crisis o necesita ayuda urgente, debe buscar apoyo profesional o acudir a los servicios de emergencia correspondientes.
