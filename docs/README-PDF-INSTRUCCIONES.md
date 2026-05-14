Generar PDF de ejemplo (instrucciones)

Este repositorio incluye un script Node.js que usa Puppeteer para convertir el mockup HTML en PDF.

Pasos:

1. Abrir PowerShell o terminal en `c:\Marakame\docs`:

```powershell
cd c:\Marakame\docs
```

2. Instalar dependencias (se instalará Puppeteer; ocupa ~100-200MB):

```powershell
npm install
```

3. Ejecutar el generador:

```powershell
npm run generate-pdf
```

4. Salida: `c:\Marakame\docs\estudio-socioeconomico.pdf`

Notas:
- El script usa rutas relativas; el logo por defecto apunta a `../frontend/src/assets/marakame.jpeg`. Asegúrate de que el archivo exista.
- Si no deseas instalar Puppeteer globalmente, puedes abrir el HTML en el navegador y exportar a PDF manualmente (ver README-mockup.md).
- Si quieres que ejecute el script aquí (en este entorno), dime y lo intento — necesitaré permiso para instalar dependencias y ejecutar `npm install`.
