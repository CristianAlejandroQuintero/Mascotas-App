# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Guardado de citas

Ejecuta `npm run dev` para iniciar la aplicación junto con la API local `/api/citas`.
Al enviar el formulario, la cita se añade a `src/citas.json` y permanece guardada
al recargar. La API permite consultar las citas con `GET /api/citas` y registrar
una nueva mediante `POST /api/citas`. Cada cita usa `correo`, `nombreMascota`,
`tipoCita`, `fecha`, `hora`, `detalles` y `estado`; `estado` acepta `pendiente`
o `completada`. En "Mis citas", la lista de pendientes y el historial se separan
por ese estado.

La estructura de cada cita es:

```json
{
  "correo": "usuario@ejemplo.com",
  "nombreMascota": "Firulais",
  "tipoCita": "Veterinaria",
  "fecha": "2026-10-15",
  "hora": "10:00",
  "detalles": "Consulta general",
  "estado": "pendiente"
}
```

Los mensajes enviados desde Contacto se guardan en `localStorage` bajo
`mascotasProMessages` y usan únicamente los campos `nombre`, `correo` y `mensaje`:

```json
{
  "nombre": "Cristian",
  "correo": "usuario@ejemplo.com",
  "mensaje": "Quiero más información sobre estética."
}
```

Si existen mensajes guardados con campos adicionales de versiones anteriores,
se normalizan a esta estructura al abrir el panel administrativo.

Esta escritura en archivo está habilitada para desarrollo local. Para publicar la
aplicación en GitHub Pages, las citas se guardan en el `localStorage` del
navegador. Ese almacenamiento es propio de cada dispositivo y no comparte citas
entre visitantes ni con el panel administrativo en otros dispositivos. Para
gestionar citas de forma centralizada, conecta los endpoints a un backend y
almacenamiento persistente de producción.

## Publicar en GitHub Pages

El flujo `.github/workflows/deploy.yml` construye y publica el sitio al hacer
push a `main` o al ejecutarlo manualmente desde GitHub Actions. En el repositorio,
abre **Settings → Pages** y selecciona **GitHub Actions** como fuente de
despliegue. El sitio queda disponible en
<https://cristianalejandroquintero.github.io/Mascotas-App/>.

El router usa el prefijo `/Mascotas-App/` configurado en Vite, y el flujo
publica una página `404.html` para que las rutas internas también funcionen al
recargar o abrir un enlace directamente.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
