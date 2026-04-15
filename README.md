# Jardín de Sentimientos

`Jardín de Sentimientos` es una aplicación web educativa e interactiva orientada al apoyo de la autorregulación emocional en estudiantes. El proyecto propone un espacio digital sencillo donde el usuario puede identificar cómo se siente, realizar una actividad breve y guardar un registro visual de su experiencia.

La aplicación está pensada principalmente para situaciones relacionadas con el contexto académico, como saturación mental, cansancio, ansiedad, dificultad para concentrarse o falta de claridad para reconocer el propio estado emocional.

> Esta aplicación no realiza diagnósticos ni sustituye el acompañamiento psicológico, médico o académico especializado. Su función es servir como herramienta de apoyo, reflexión y organización personal.

## Objetivo del proyecto

El objetivo principal es ofrecer una experiencia accesible y visual que ayude al usuario a hacer una pausa, reconocer su estado emocional y elegir una actividad de regulación o expresión acorde a lo que está sintiendo.

La aplicación busca que el usuario pueda:

- Identificar cómo se siente en un momento determinado.
- Elegir una actividad breve según su estado emocional.
- Expresar preocupaciones, cansancio o ansiedad de forma visual.
- Organizar pensamientos o tareas académicas.
- Registrar sus actividades en una bitácora personal.

## ¿Qué hace la aplicación?

Después de iniciar sesión, el usuario entra a una pantalla principal donde se le pregunta cómo se siente. A partir de su respuesta, la aplicación abre una actividad relacionada.

Las opciones principales son:

- **No sé cómo me siento**: muestra una evaluación rápida para orientar al usuario hacia una actividad.
- **Me siento saturado mentalmente**: abre un tablero de notas para organizar pendientes o preocupaciones.
- **No me puedo concentrar**: abre un pizarrón creativo para dibujar, escribir visualmente o expresarse con formas.
- **Me siento agotado**: abre una respiración guiada por sesiones de un minuto.
- **Me siento ansioso**: abre un juego relajante donde se protege una flor de pensamientos negativos.

Al finalizar una actividad, la aplicación pregunta cómo se siente el usuario y permite agregar un comentario opcional. Después guarda una imagen de la actividad y sus datos principales en una bitácora.

## Actividades

### Tablero de notas

Permite crear hasta tres notas visuales para organizar lo que el usuario tiene en mente. Cada nota puede moverse, cambiar de tamaño, editarse y recibir una prioridad: alta, media o baja.

El formulario de cada nota guía al usuario con preguntas breves:

- Qué tiene en mente.
- Si está en sus manos hacer algo.
- Qué puede hacer de forma inmediata.
- Cómo se siente si no puede resolverlo en ese momento.

La intención es ayudar a convertir preocupaciones generales en ideas más concretas y manejables.

### Pizarrón creativo

Es un lienzo libre para dibujar, crear figuras, cambiar colores, mover elementos y subir imágenes. Está pensado para usuarios que necesitan expresar algo visualmente o desbloquear su concentración.

El pizarrón recuerda al usuario que no necesita saber dibujar; lo importante es usar líneas, colores o imágenes para expresar lo que siente.

### Respiración guiada

Actividad de pausa y regulación. El usuario inicia una sesión de respiración de un minuto. Al terminar, la aplicación pregunta si se siente más tranquilo o si necesita respirar otra vez.

Si el usuario necesita continuar, puede repetir otra sesión. Al finalizar, se guarda cuántas sesiones realizó.

### Riega tu calma

Juego 2D con una dinámica inspirada en juegos arcade, pero con un enfoque emocional y no violento. El usuario controla una manguera y lanza gotas de agua para proteger una flor de pensamientos negativos relacionados con el estrés académico.

La flor representa el estado emocional del usuario y los elementos negativos representan ideas como falta de tiempo, autoexigencia, frustración o sobrecarga académica.

### Evaluación rápida

Cuando el usuario no sabe cómo se siente, responde una evaluación breve del 1 al 5. Con base en sus respuestas, la aplicación sugiere una actividad.

Esta evaluación no es diagnóstica; solo funciona como apoyo para orientar al usuario.

## Bitácora

La bitácora muestra las actividades guardadas por el usuario como una galería agrupada por fecha.

Cada registro puede incluir:

- Imagen de la actividad.
- Nombre de la actividad.
- Fecha y hora.
- Respuesta final del usuario.
- Comentario opcional.
- Datos adicionales, como número de sesiones en respiración.

Al seleccionar una imagen, se muestra una vista ampliada con los detalles de la actividad y la opción de descargarla.

## Tecnologías utilizadas

El proyecto está desarrollado con tecnologías web básicas y Firebase.

- **HTML5**: estructura de las pantallas y formularios.
- **CSS3**: estilos, diseño responsivo, tema claro y tema oscuro.
- **JavaScript puro con módulos ES**: lógica de la aplicación, navegación, actividades e interacción.
- **Canvas API**: actividades visuales como tablero, pizarrón y juego.
- **Firebase Authentication**: registro, inicio y cierre de sesión.
- **Firebase Realtime Database**: almacenamiento de usuarios y actividades.
- **Firebase Storage**: almacenamiento de imágenes de perfil y capturas de actividades.
- **Font Awesome**: iconos de apoyo visual.
- **localStorage**: preferencias locales como tema y sonido.

No se utiliza React, Vue, Angular ni otro framework. Tampoco se requiere instalar dependencias con `npm`.

## Estructura general del proyecto

```text
Jardin-de-sentimientos/
├── app.js
├── index.html
├── README.md
├── componentes/
├── estilos/
├── modulos/
├── nucleo/
├── recursos/
├── servicios/
└── utilidades/
```

### Carpetas principales

- `componentes/`: elementos reutilizables de interfaz, como tutoriales, menús, evaluaciones y canvas.
- `estilos/`: estilos globales, variables, temas y componentes visuales.
- `modulos/`: pantallas principales y actividades de la aplicación.
- `nucleo/`: coordinación general de pantallas, sesión y estado de la aplicación.
- `recursos/`: imágenes, iconos y audios.
- `servicios/`: conexión con Firebase, autenticación, base de datos, storage y preferencias.
- `utilidades/`: funciones auxiliares y modelos reutilizables.

## Organización de actividades

```text
modulos/actividades/
├── ansioso/
├── cansado/
├── pizarron/
└── tablero/
```

- `ansioso/`: contiene el juego `Riega tu calma`.
- `cansado/`: contiene la respiración guiada.
- `pizarron/`: contiene el lienzo creativo.
- `tablero/`: contiene el tablero de notas.

## Firebase

La configuración principal de Firebase se encuentra en:

```text
servicios/firebase_config.js
```

La aplicación utiliza tres servicios principales:

- **Authentication** para identificar al usuario.
- **Realtime Database** para guardar datos del usuario y registros de actividades.
- **Storage** para guardar imágenes.

Las actividades se guardan en Storage con una ruta similar a:

```text
usuarios/{uid}/actividades/{actividad}_{fecha}_{hora}.jpg
```

Los datos de cada actividad se guardan dentro del usuario en Realtime Database:

```text
usuarios/{uid}/actividades/{idActividad}
```

Ejemplo de registro:

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

## Preferencias locales

El tema visual y el sonido de las actividades se guardan en el navegador mediante `localStorage`. Estas preferencias son locales y no se guardan en la base de datos.

Esto permite que cada dispositivo conserve su propia configuración.

## Cómo ejecutar el proyecto

El proyecto debe ejecutarse con un servidor local para que funcionen correctamente los módulos JavaScript y las rutas de recursos.

Opción recomendada:

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Instalar la extensión `Live Server`.
3. Abrir `index.html`.
4. Ejecutar `Open with Live Server`.

La URL local suele ser:

```text
http://127.0.0.1:5500/
```

También puede usarse un servidor estático, por ejemplo:

```bash
python -m http.server 5500
```

## Estado del proyecto

Actualmente el proyecto cuenta con:

- Autenticación de usuarios.
- Registro con foto opcional y foto predeterminada.
- Pantalla de inicio con selección emocional.
- Evaluación rápida.
- Cuatro actividades interactivas.
- Guardado de imágenes en Firebase Storage.
- Registro de actividades en Realtime Database.
- Bitácora visual agrupada por fecha.
- Tema claro y oscuro.
- Preferencias locales.
- Diseño responsivo para móvil, tablet y escritorio.

## Posibles mejoras futuras

- Agregar filtros en la bitácora por fecha o tipo de actividad.
- Mejorar la accesibilidad completa por teclado en actividades con canvas.
- Agregar más sonidos ambientales.
- Crear estadísticas visuales sobre actividades realizadas.
- Permitir exportar reportes para análisis académico.
