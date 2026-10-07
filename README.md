# Piura Go Map

Quiero que conviertas el wireframe/prototipo adjunto de PiuraGo en una app web multiplataforma de rutas para la ciudad de Piura, enfocada en consulta de rutas, paraderos, ETA, ubicación colaborativa y congestión.

1. Objetivo general

Desarrolla únicamente el frontend, tomando como base el wireframe adjunto y respetando su estructura visual y funcional. No quiero un rediseño completamente diferente: quiero una evolución del wireframe, mejorando la experiencia de usuario, las transiciones y la adaptación responsive.

La aplicación debe funcionar correctamente en móvil, tablet y laptop/desktop.

La experiencia principal de la aplicación debe ser el mapa, no una lista de rutas.

2. Identidad visual

Usa como color principal para botones y acciones el #226CCD, incluyendo variantes de este color para estados hover, active, disabled y elementos secundarios en modo light.

Usa una interfaz moderna, limpia y clara.

En el header debe aparecer:

Un logo de PiuraGo con contorno circular.

Al lado del logo, el nombre PiuraGo.

En las secciones Rutas, Mapa y Congestión, mostrar:

“Iniciar sesión” cuando el usuario sea anónimo.

“Hola Ramirez!” cuando el usuario esté conectado.

No utilices difuminados, blur, glassmorphism ni fondos excesivamente translúcidos. Evita una interfaz recargada.

3. Flujo general de navegación

Cualquier forma de acceso a la aplicación debe terminar llevando al Mapa, que será la experiencia principal:

Iniciar sesión → Mapa.

Registrarse → Mapa.

Continuar como pasajero anónimo → Mapa.

No quiero que el usuario quede atrapado en pantallas intermedias después de autenticarse.

Todas las interacciones importantes deben tener animaciones y transiciones suaves, con tiempos de duración coherentes para que la interfaz se sienta fluida.

4. Pantalla de inicio de sesión

Mantén la estructura del wireframe actual de autenticación. El prototipo ya contempla los accesos de iniciar sesión, crear cuenta, credenciales institucionales y acceso mediante Google.

Haz los siguientes cambios:

Debajo del formulario de inicio de sesión debe aparecer:

¿No tienes una cuenta?
Regístrate aquí

“Regístrate aquí” debe funcionar como enlace hacia el registro.

Debajo del botón principal de login, mostrar:

o Inicia sesión con:

Y debajo colocar:

Correo institucional | Cuenta de Google

Estas dos opciones deben pertenecer a un mismo grupo visual tipo píldora, limpio y compacto, sin convertirlo en una tarjeta grande ni agregar un borde pesado.

5. Registro

La pantalla de registro debe conservar el mismo lenguaje visual del login.

Una vez completado el registro, el usuario debe ser llevado directamente al Mapa.

6. Modal de ubicación

Al entrar a la aplicación, mostrar un modal centrado de activación de ubicación.

El modal debe explicar de forma sencilla que PiuraGo necesita la ubicación para mostrar la posición del usuario y mejorar la experiencia de consulta de rutas.

Debe existir la posibilidad de:

Activar ubicación.

Continuar sin activar ubicación.

Por ahora NO activar ubicación real. Utiliza una ubicación simulada para la demostración.

El aviso inicial de ubicación debe estar centrado visualmente.

7. Diferenciar pasajero anónimo y pasajero logueado

Debe notarse claramente la diferencia entre ambos estados.

Pasajero anónimo

Puede:

Consultar rutas.

Consultar paraderos.

Ver el mapa.

Ver ETA simuladas.

Ver rutas y congestión.

Debe mostrarse visualmente que está en modo pasajero anónimo.

Pasajero logueado

Además de lo anterior, puede:

Ver su sesión iniciada.

Seleccionar una ruta.

Confirmar que abordó una unidad.

Activar la colaboración de ubicación simulada.

Ver el estado de su trayecto.

La diferencia debe ser principalmente visual y funcional, sin cambiar completamente el diseño.

8. MAPA: experiencia principal

Después de cualquier acceso, mostrar directamente el Mapa en pantalla completa.

El mapa debe ser el elemento visual dominante de la aplicación.

Agregar:

Buscador flotante.

Botón de ubicación.

Controles del mapa.

Ubicación actual simulada.

Unidades de transporte simuladas.

Pasajeros colaboradores simulados.

Rutas dibujadas sobre el mapa.

ETA simulada.

Panel inferior deslizable.

9. Interacciones principales del mapa

Botón de ubicación

Al presionar el botón de ubicación:

Colocar el punto de ubicación actual simulada sobre el mapa.

Centrar visualmente el mapa en esa ubicación.

Aplicar una pequeña animación de movimiento/centrado.

Buscador

Cuando el usuario pulse el buscador:

Seleccionar automáticamente Mercado Central de Piura como destino de la demostración.

Mostrar visualmente el destino seleccionado.

Tres segundos después de seleccionar el destino:

Dibujar una ruta simulada por puntos desde la ubicación actual hasta Mercado Central de Piura.

Mostrar unidades de transporte en el recorrido.

Mostrar pasajeros colaboradores simulados.

Mostrar progresivamente los elementos mediante una transición, no todos de golpe.

El retraso de 3 segundos es obligatorio porque forma parte de la demostración del flujo.

10. Panel inferior deslizable

Sobre el mapa debe existir un panel inferior deslizable.

El panel debe poder:

Aparecer en estado contraído.

Expandirse.

Deslizarse verticalmente.

Mantener una transición suave.

No bloquear permanentemente la interacción con el mapa.

Debe mostrar:

Rutas cercanas

Rutas más usadas

Ver todas las rutas

Cada tarjeta de ruta debe mostrar como mínimo:

Nombre real de la línea.

Lugares/paraderos principales por los que pasa.

Hora estimada de llegada.

ETA.

Botón “Ir”.

No utilices nombres genéricos como “Ruta A”, “Ruta 1”, etc. Usa los nombres reales de las líneas y rutas presentes en los datos del prototipo. El wireframe incluye, por ejemplo, la Línea 10: Castilla • Catacaos • Mercado Central y otra Combi Interurbana Ruta B: Piura • Veintiséis de Octubre.

11. Selección de una ruta

Cuando el usuario presione “Ir” en una tarjeta:

Limpiar la ruta anterior del mapa.

Mostrar únicamente la ruta seleccionada.

Mostrar nuevamente el punto de inicio.

Mostrar el recorrido correspondiente.

Abrir el panel con información de la ruta.

La información debe aparecer inicialmente con la hoja de ruta contraída.

El usuario podrá expandirla para ver:

Paradero actual.

Próximos paraderos.

Tiempo restante.

ETA.

Secuencia ordenada de paraderos.

El wireframe ya contempla una secuencia de paraderos y el comportamiento de colapsar/expandir la hoja de ruta, por lo que esta interacción debe conservarse y mejorarse.

12. Estado del paradero actual

Dentro de la hoja de ruta:

La parada actual debe destacarse visualmente en azul.

Mostrar el tiempo restante.

Mostrar cuál es el siguiente paradero.

Permitir marcar la parada como “superada”.

Cuando se marque como superada, actualizar visualmente el progreso del trayecto.

El siguiente paradero debe pasar automáticamente a ser el actual.

La interacción debe sentirse como un seguimiento de viaje en tiempo real, aunque la información sea simulada.

13. Hoja de ruta

La hoja de ruta debe iniciar contraída para no ocupar demasiado espacio.

Al expandirse, debe mostrar una lista ordenada de paraderos.

Ejemplo visual:

Paradero actual
Mercado Central — 0 min

↓

Óvalo Bolognesi — +6 min

↓

Universidad Nacional de Piura — +14 min

↓

Terminal Catacaos — +25 min

Utiliza los datos disponibles en el prototipo y conserva los nombres de paraderos existentes.

14. RESPONSIVE

La interfaz debe tener dos comportamientos principales.

Móvil

El mapa ocupa prácticamente toda la pantalla.

Encima del mapa deben aparecer:

Buscador.

Botón de ubicación.

Controles.

Información contextual.

En la parte inferior:

Panel deslizable de rutas.

Hoja de ruta.

Navegación inferior fija.

El menú inferior debe permanecer estático/fijo aunque el usuario haga scroll o desplace contenido.

No debe desaparecer mientras se navega.

Laptop / Desktop

Utilizar:

Menú lateral izquierdo.

Mapa ocupando el espacio principal.

Paneles laterales o flotantes cuando sea necesario.

La navegación debe adaptarse a un layout de escritorio, sin conservar forzosamente la navegación inferior del móvil.

15. Secciones principales

La app debe mantener tres secciones principales:

Rutas
Consulta de líneas, recorridos y paraderos.

Mapa
Experiencia principal de navegación, ubicación, rutas simuladas, unidades y colaboradores.

Congestión
Dashboard de zonas y horarios con mayor congestión.

En las tres secciones debe respetarse el comportamiento del header:

Anónimo → Iniciar sesión

Logueado → Hola Ramirez!

16. Congestión

Mantener la idea del dashboard del wireframe para visualizar:

Franjas horarias.

Nivel de congestión.

Tramos más congestionados.

Demora estimada.

Velocidad promedio.

Puntos críticos.

El wireframe plantea un dashboard de Congestión y Horas Calientes, con filtros temporales y tramos críticos, por lo que conserva esta estructura como referencia.

17. Objetivos funcionales de PiuraGo

La interfaz debe estar diseñada alrededor de estos objetivos:

1. Consulta de rutas y paraderos
Diseñar e implementar un módulo que permita al usuario identificar las combis disponibles y sus puntos de parada en la ciudad de Piura.

2. Cálculo de ETA
Desarrollar un servicio de cálculo de ETA basado en reportes de ubicación GPS enviados por pasajeros colaboradores, aplicando una arquitectura MVC + DAO bajo principios SOLID, para ayudar al usuario a evitar tiempos de espera innecesarios en los paraderos.

3. Mapa interactivo y congestión
Construir un mapa interactivo con la posición estimada de las unidades y un dashboard de zonas y franjas horarias de mayor congestión, permitiendo identificar patrones de tráfico y ajustar horarios o rutas de desplazamiento.

18. Alcance técnico

IMPORTANTE:

Mantener la simulación actual.

No activar cuentas reales.

No utilizar ubicación GPS real.

No implementar autenticación real.

No conectar servicios externos innecesarios.

Reutilizar los datos existentes y el cálculo de ETA actual.

Ampliar principalmente los estados visuales, interacciones y transiciones.

Mantener la lógica existente siempre que sea posible.

No reemplazar datos de demostración por placeholders genéricos.

No modificar innecesariamente otras partes del proyecto.

19. Animaciones e interacción

Todas las acciones importantes deben tener una transición visual clara:

Abrir/cerrar panel.

Expandir/contraer hoja de ruta.

Seleccionar una ruta.

Centrar ubicación.

Aparecer la ruta después de 3 segundos.

Cambiar de pasajero anónimo a logueado.

Marcar paradero como superado.

Cambiar entre Rutas, Mapa y Congestión.

Abrir/cerrar modales.

Las animaciones deben ser suaves y rápidas, evitando efectos exagerados.

20. Criterio final de implementación

Quiero que el resultado se sienta como una app real de movilidad urbana de Piura, no como una colección de pantallas estáticas.

La navegación debe ser intuitiva:

Entrada → Modal de ubicación → Mapa → Buscar destino → Esperar 3 segundos → Ruta simulada → Seleccionar línea → Hoja de ruta contraída → Confirmar paradero → Seguir recorrido.

El mapa debe ser el protagonista y todos los paneles, controles y tarjetas deben integrarse alrededor de él.

Antes de terminar, valida que:

El flujo completo funcione en móvil.

El flujo completo funcione en laptop.

El menú inferior quede fijo en móvil.

El menú lateral funcione en laptop.

El modal de ubicación aparezca al entrar.

El buscador seleccione Mercado Central de Piura.

La ruta aparezca exactamente después de 3 segundos.

Existan pasajeros colaboradores simulados.

Las rutas utilicen nombres reales de los datos disponibles.

La hoja de ruta comience contraída.

La parada actual se destaque en azul.

Se pueda marcar una parada como superada.

El estado anónimo y logueado sea visualmente diferenciable.

Los botones utilicen el color base #226CCD y sus variantes.

No haya difuminados ni efectos glassmorphism.

Las transiciones sean consistentes.

No se rompa el diseño en diferentes tamaños de pantalla.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://piura-go-map.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f49bbb1-f20a-489e-aeee-eda2a7977723).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
