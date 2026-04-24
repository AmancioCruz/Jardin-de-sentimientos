# Jardín de Sentimientos

`Jardín de Sentimientos` es una aplicación web académica orientada al acompañamiento emocional de estudiantes de posgrado. Su propósito es ofrecer un espacio digital breve, claro e interactivo donde la persona usuaria pueda identificar cómo se siente, realizar una actividad de apoyo y guardar un registro de su experiencia.

La aplicación no sustituye atención psicológica, médica o académica especializada. Su función es servir como herramienta de apoyo, autorreflexión y organización personal dentro del contexto universitario.

## Propósito del proyecto

El proyecto fue desarrollado como una propuesta digital de apoyo para la gestión del estrés académico. La aplicación busca:

- facilitar una pausa breve dentro de la rutina escolar
- ayudar a reconocer estados emocionales frecuentes
- ofrecer actividades interactivas según la necesidad del momento
- registrar experiencias y respuestas del usuario en una bitácora personal

## Pantallas principales

### Inicio

Es la pantalla principal después de iniciar sesión. Presenta una pregunta central sobre cómo se siente el usuario y permite elegir una actividad o una evaluación rápida para orientar la experiencia.

### Mi espacio

Reúne la información personal del usuario y su historial de uso. Incluye una tarjeta de presentación, un resumen del recorrido dentro de la aplicación y una lista de momentos guardados.

### Ayuda

Muestra información de contacto institucional relacionada con bienestar universitario. Incluye contactos directos, sede principal, directorio por instituto y campus, y una nota final de orientación.

### Configuración

Permite ajustar preferencias de uso, como sonido y tema visual. Está planteada como una pantalla simple de formulario.

### Inicio de sesión

Pantalla de acceso para usuarios registrados. Su objetivo es permitir el ingreso al sistema con correo y contraseña.

### Registro

Pantalla para crear una cuenta nueva. Solicita datos básicos del usuario y presenta el aviso de consentimiento informado y términos de uso.

## Actividades

La aplicación integra actividades breves e interactivas que responden a distintos estados emocionales.

### Evaluación rápida

Se activa cuando la persona usuaria no tiene claridad sobre cómo se siente. Presenta una serie breve de afirmaciones con escala del 1 al 5 y orienta hacia una actividad.

### Tablero de notas

Actividad pensada para organizar ideas, pendientes o preocupaciones. Permite crear notas, clasificarlas y editar su contenido dentro de un espacio visual simple.

### Pizarrón creativo

Actividad libre de expresión visual. Permite dibujar, agregar formas, mover elementos y trabajar con color para expresar ideas o emociones de manera gráfica.

### Respiración guiada

Actividad de pausa breve enfocada en la regulación. Presenta una secuencia guiada de respiración con sesiones cortas y una pantalla final de cierre.

### Riega tu calma

Actividad lúdica con enfoque de autorregulación. La dinámica propone proteger una flor de elementos negativos asociados a estrés, saturación o inquietud.

### ¿Qué más puedo hacer?

Pantalla de apoyo complementario con herramientas breves y concretas. Funciona como una extensión de las actividades principales para momentos en los que el usuario necesita una alternativa adicional.

## Registro y seguimiento

La aplicación guarda la experiencia del usuario en una bitácora personal. Cada momento puede incluir:

- nombre de la actividad
- fecha de realización
- respuesta final
- comentario opcional
- imagen o captura de la actividad, cuando aplica

Esto permite revisar el historial de uso y recuperar momentos previos dentro de `Mi espacio`.

## Estructura técnica general

El proyecto está construido con tecnologías web base y módulos ES.

- `HTML5`: estructura de pantallas y componentes
- `CSS3`: sistema visual, layout responsivo, temas y estilos
- `JavaScript modular`: navegación, estado de aplicación, interacción y actividades
- `Canvas API`: soporte para actividades visuales e interactivas
- `Firebase Authentication`: inicio de sesión y registro
- `Firebase Realtime Database`: persistencia de datos de usuario y actividades
- `Firebase Storage`: almacenamiento de imágenes de perfil y capturas
- `localStorage`: persistencia de preferencias locales

## Organización del proyecto

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

- `componentes/`: piezas reutilizables de interfaz
- `estilos/`: base visual, variables, componentes y estilos de módulos
- `modulos/`: pantallas y actividades principales
- `nucleo/`: coordinación general de navegación y estado
- `recursos/`: imágenes, iconos y otros assets
- `servicios/`: Firebase, sesión, overlays y preferencias
- `utilidades/`: funciones auxiliares y constructores reutilizables

## Ejecución del proyecto

La aplicación debe ejecutarse con un servidor local para permitir el uso correcto de módulos JavaScript y recursos.

Opciones habituales:

```bash
python -m http.server 5500
```

o mediante una extensión como `Live Server` en Visual Studio Code.

## Referencias y recursos utilizados

### Tipografía

- `Inter`
  Fuente cargada desde Google Fonts.
  Referencia: [https://fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter)

### Iconografía

- `Font Awesome`
  Utilizada para iconos de navegación, formularios, acciones y apoyo visual.
  Referencia: [https://fontawesome.com/](https://fontawesome.com/)

### Logo e iconos propios

- Los elementos de identidad visual propios de la aplicación se encuentran dentro de `recursos/iconos/`.

### Plataforma y servicios

- `Firebase`
  Utilizado para autenticación, base de datos y almacenamiento.
  Referencia: [https://firebase.google.com/](https://firebase.google.com/)

## Alcance académico del proyecto

El proyecto está planteado como una aplicación académica de apoyo y no como un sistema clínico. Su valor principal está en la integración de:

- interfaz responsiva
- actividades breves interactivas
- registro de experiencia del usuario
- organización de información emocional dentro de un entorno universitario

## Estado actual

Actualmente el proyecto incluye:

- autenticación de usuario
- registro e inicio de sesión
- pantalla de inicio con selección de actividad
- actividades interactivas
- evaluación rápida
- bitácora de momentos
- pantallas de ayuda, configuración y perfil
- diseño adaptado para móvil, tablet y escritorio
