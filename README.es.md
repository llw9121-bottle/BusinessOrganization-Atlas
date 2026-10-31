# Atlas de modelos de negocio × organización

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · **Español** · [Français](README.fr.md)

Un atlas interactivo que conecta las **decisiones de modelo de negocio** con las **formas
organizativas, las fuerzas y las transiciones**. Es una guía de campo interpretativa de *Understanding
Organizations...Finally!* de Henry Mintzberg (Berrett-Koehler, 2023), no un sustituto del libro.

Está pensado para fundadores, operadores, consultores y estudiantes que quieren hacerse mejores
preguntas sobre por qué una organización funciona como funciona y qué tendría que cambiar para que
encaje otro modelo.

- **Sin cuenta, sin backend, sin analítica.** Todos los cálculos ocurren en tu navegador.
- **Seis idiomas.** English, 简体中文, 日本語, 한국어, Español y Français cambian al instante.
- **Sin compilación y sin dependencias.** Solo HTML, CSS y ES Modules nativos.

## Recorrido

El atlas tiene diez secciones. La primera, Puente, se abre por defecto.

| Sección | Qué puedes hacer |
| --- | --- |
| **01 Puente** | Combina cuatro decisiones de modelo (cliente, valor, economía y límite) y descubre qué forma organizativa favorecen, dónde generan tensión y qué contrapeso las mantiene sanas. |
| **02 Lienzo** | Recorre los nueve bloques del modelo de negocio con una mirada organizativa. |
| **03 Patrones** | Explora cinco patrones recurrentes: desagregado, cola larga, multilateral, gratuito y abierto. |
| **04 Diseño** | Parte de un epicentro de diseño y sigue las decisiones y preguntas que unen modelo y organización. |
| **05 Casos** | Lee ejemplos de empresas reales y salta al escenario correspondiente de Puente. |
| **06 Atlas** | Sitúa las cuatro formas fundamentales en un mapa de diamante e inspecciona las tres formas secundarias. |
| **07 Formas** | Lee perfiles profundos de las siete formas: motor de coordinación, poder, condiciones, riesgo y ejemplos. |
| **08 Fuerzas** | Sube las siete fuerzas con los controles; el estudio nombra la forma que favorecen y el contrapeso que las contiene. |
| **09 Cambio** | Sigue las etapas del ciclo de vida y las rutas de transición habituales. |
| **10 Acerca de** | Consulta la fuente, el alcance y el método de la interpretación. |

## Inicio rápido

Solo necesitas **Node.js 18+** o **Python 3** para servir archivos estáticos. No hay nada que instalar
ni compilar.

```bash
# Recomendado: servidor Node incluido, sin dependencias
npm start
```

```bash
# Alternativa: servidor estático de Python
python -m http.server 8765 --bind 127.0.0.1
```

Abre <http://127.0.0.1:8765/>. Para detener el servidor, pulsa `Ctrl+C`.

**¿Por qué hace falta un servidor local?** La aplicación usa ES Modules nativos. Por seguridad, los
navegadores bloquean las importaciones de módulos desde páginas `file://`, así que abrir `index.html`
con doble clic mostrará una página vacía o rota. Servirlo por HTTP lo resuelve sin cambiar el código.

Si el puerto 8765 está ocupado:

```bash
PORT=9000 npm start
```

En Windows PowerShell: `$env:PORT=9000; npm start`.

## Estructura del proyecto

```text
index.html                  Marcado semántico y único punto de entrada
package.json                Solo scripts; sin dependencias de ejecución
styles/                     Una hoja de estilos por capa o vista
  fonts.css                 @font-face de nueve WOFF2 locales
  tokens.css                Variables de color, espaciado y tipografía
  base.css                  Reset, valores por defecto y salto natural de títulos
  layout.css                Cabecera, navegación, selector de idioma, marco de vista
  atlas.css ... overrides.css  Estilos por vista, en orden de origen
assets/fonts/               Subconjuntos de Inter y Noto Sans SC/JP/KR con licencias
js/
  app.js                    Raíz de composición: inicio, idioma, rutas hash
  core/html.js              Escape de HTML y renderizado de diagramas
  i18n/                     Metadatos, traducciones, t(), etiquetas localizadas
  data/                     Datos puros: formas, fuerzas, etapas, rutas, reglas...
  ui/                       Un módulo por vista; posee su estado y su renderizado
scripts/
  serve.mjs                 Servidor estático local sin dependencias
  audit.mjs                 Auditoría estructural, de seguridad, accesibilidad y datos
```

## Cómo está construido

Los módulos forman una cadena de dependencias en un solo sentido:

```text
data  ->  i18n  ->  ui  ->  app.js
```

- **`js/data/`** son módulos hoja. Exportan objetos planos y no importan nada, lo que facilita probarlos,
  compararlos y reutilizarlos.
- **`js/i18n/`** posee el idioma actual. Las claves de traducción son exactamente las cadenas originales
  en inglés del marcado y los datos, así que el inglés no necesita tabla de búsqueda y una traducción
  ausente vuelve al inglés de forma segura.
- **`js/ui/`** contiene un módulo por vista. Cada uno posee su estado y exporta `renderXView()` e
  `initXView()`. Las acciones entre vistas pasan por una API estrecha: por ejemplo, otras vistas llaman
  a `applyBridgePreset()` en lugar de modificar el estado de Puente directamente.
- **`js/app.js`** es la raíz de composición: conecta los módulos, renderiza en un orden fijo, gestiona el
  selector de idioma y resuelve enlaces profundos como `#bridge` o `#atlas`.

Notas de implementación:

- Las hojas CSS se cargan en su orden de cascada original. `responsive.css` y `overrides.css` deben
  quedar al final.
- El único valor persistido es el idioma en `localStorage` (`organization-atlas-language`). Los fallos de
  lectura y escritura están gestionados.
- La navegación usa `history.replaceState`, así que cambiar de pestaña no llena el historial del
  navegador.
- Los títulos se ajustan con saltos de línea naturales según el idioma y la pantalla. Se respeta la preferencia de movimiento reducido.
- El estudio ofrece un ejemplo guiado de Google Search, bloques Canvas conectados y comparaciones de escenarios y formas organizativas. Estos estados solo se conservan durante la visita actual.

## Tareas habituales

**Cambiar textos o datos de dominio.** Edita el archivo correspondiente en `js/data/` o el texto de
`index.html`. Los datos son objetos planos, sin paso de compilación.

**Añadir o corregir una traducción.** Busca la cadena original en inglés (la clave) y añádela al idioma
correspondiente en `js/i18n/translations.js`. Para añadidos puntuales, sigue el patrón existente
`Object.assign(translations.<idioma>.strings, { ... })` al final del archivo.

**Añadir un idioma.** Añade una entrada en `js/i18n/languages.js`, añade o asigna un objeto
`translations.<idioma>` y agrega un `<option>` a `#language-select` en `index.html`.

**Añadir una forma o una fuerza.** Actualiza el módulo de datos correspondiente, añade los controles en el
marcado y amplía los datos de puente y perfiles de modelo. Después ejecuta la auditoría: comprueba las
claves foráneas entre todos estos archivos.

## Comprobaciones de calidad

```bash
npm run audit
```

La auditoría no tiene dependencias y verifica:

- Que cada módulo JavaScript se analiza, solo importa rutas relativas y el grafo de importaciones no
  tiene ciclos.
- Que la página tiene exactamente un script de módulo externo, sin scripts ni estilos en línea, y sin
  manejadores de eventos ni atributos `style` en línea.
- Que la CSP es de denegación por defecto y no contiene `unsafe-inline` ni `unsafe-eval`.
- Que las hojas de estilo cargan en el orden esperado, y que cada `url()` de CSS y cada fuente WOFF2
  existen y son válidos.
- Que los ID de elementos son únicos; cada fragmento, enlace local y enlace externo HTTPS es seguro; y
  los enlaces externos usan `noopener noreferrer`.
- Que cada ID de DOM referenciado desde JavaScript existe en el marcado.
- Que las claves foráneas de datos son coherentes: formas, perfiles, diagramas, fuerzas, preajustes,
  grupos y preajustes de puente, reglas de tensión, patrones, etapas, rutas, bloques del lienzo y
  epicentros de diseño.
- Que la paleta de texto principal cumple el contraste WCAG AA (4.5:1) sobre los tres fondos.
- Que existen las seis versiones del README.

## Seguridad y privacidad

- La página **no realiza ninguna petición de red** y no tiene backend, analítica, cookies, formularios,
  iframes ni ingesta de contenido de usuario.
- El único valor persistido es el idioma seleccionado en `localStorage`.
- Los enlaces externos de casos y licencias se abren solo tras un clic explícito y usan
  `rel="noopener noreferrer"`.
- Las plantillas HTML dinámicas escapan el texto traducido. Los cuerpos SVG estructurales siguen siendo
  datos estáticos de confianza.
- La CSP bloquea recursos remotos y todas las conexiones de datos. Para servirla públicamente, añade una
  CSP por cabecera de respuesta y `frame-ancestors 'none'` en el servidor web o CDN.

## Fuentes y licencias

La página incluye subconjuntos WOFF2 locales de **Inter** y **Noto Sans SC / JP / KR**. Estas fuentes
están licenciadas bajo la SIL Open Font License 1.1. Atribución y texto completo de la licencia:

- [`assets/fonts/FONT-LICENSES.txt`](assets/fonts/FONT-LICENSES.txt)

No se carga ninguna fuente desde servidores de terceros.

## Fuente y alcance

Esta interfaz resume los capítulos 2–21 de *Understanding Organizations...Finally!: Structure in
Sevens* de Henry Mintzberg (Berrett-Koehler, 2023). Es una visión interpretativa independiente. No
reproduce el libro ni es un instrumento de diagnóstico validado. Trata cada resultado como una hipótesis
que debes contrastar con el trabajo real, los incentivos, el poder, la historia y la evidencia de los
clientes.

## Compatibilidad

Versiones actuales de Chrome, Edge, Firefox y Safari. La aplicación necesita ES Modules,
`localStorage` y CSS moderno; funciona sin conexión una vez cargada.
