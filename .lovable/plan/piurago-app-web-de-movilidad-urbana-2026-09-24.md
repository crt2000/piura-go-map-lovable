# PiuraGo — app web de movilidad urbana

## Objetivo
Convertir la pantalla inicial vacía en una experiencia frontend completa y simulada, centrada en un mapa de Piura y adaptable a móvil, tablet y escritorio.

## Implementación
- Crear un sistema visual limpio basado en `#226CCD`, sin blur ni glassmorphism, incorporando el logo adjunto mediante el flujo de assets.
- Construir una sola experiencia navegable con tres vistas: **Rutas**, **Mapa** y **Congestión**; navegación inferior fija en móvil y lateral colapsable en escritorio.
- Añadir acceso y registro simulados con correo, credenciales institucionales, Google y modo pasajero anónimo; todos terminan directamente en el mapa.
- Mostrar al entrar un aviso centrado de ubicación con activación simulada o continuación sin ubicación real.
- Crear un mapa visual interactivo de Piura con calles, rutas, paraderos, ubicación simulada, unidades, colaboradores, buscador y controles.
- Implementar el flujo del buscador: seleccionar Mercado Central, esperar exactamente 3 segundos y revelar progresivamente ruta, unidades y colaboradores.
- Añadir un panel inferior deslizable en móvil y panel contextual en escritorio, con rutas reales del prototipo, ETA y selección mediante “Ir”.
- Implementar seguimiento de viaje para usuarios conectados: hoja de ruta inicialmente contraída, parada actual azul, siguiente parada, avance y colaboración simulada.
- Construir el tablero de congestión con franjas horarias, tramos críticos, demoras, velocidades y filtros simulados.
- Añadir transiciones coherentes para paneles, selección, centrado, autenticación, modales, navegación y progreso.

## Datos y límites
- Todo será frontend y simulado: sin cuentas, GPS, servicios externos ni persistencia remota.
- Se usarán los nombres proporcionados: Línea 10, Combi Interurbana Ruta B, Mercado Central, Óvalo Bolognesi, Universidad Nacional de Piura y Terminal Catacaos.

## Validación
- Probar el flujo completo en móvil y escritorio.
- Confirmar navegación fija/adaptable, aviso inicial, demora de 3 segundos, panel deslizable, estados anónimo/conectado, selección de ruta y avance de paraderos.
- Revisar visualmente que no existan solapamientos y confirmar que la aplicación compile sin errores.
