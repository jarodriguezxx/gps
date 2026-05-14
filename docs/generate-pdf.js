const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();

    const fileArg = process.argv[2] || 'estudio-socioeconomico-mockup.html';
    const htmlPath = path.resolve(__dirname, fileArg);
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Ensure images referenced relatively load by adding a base tag
    const base = `<base href="file://${path.resolve(__dirname)}/" />`;
    html = html.replace(/<head>/i, `<head>\n    ${base}`);

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfPath = path.resolve(__dirname, 'estudio-socioeconomico.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
    });

    await browser.close();
    console.log('PDF generado en:', pdfPath);
  } catch (err) {
    console.error('Error generando PDF:', err);
    process.exit(1);
  }
})();
