import React from 'react';
import { CalendarDays, FileText, Hash, Landmark, Printer, QrCode, Stamp } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const FISCAL_DATA = {
  rfc: 'MAR080325RRA',
  domicilio: 'Carr. Presa Aguamilpa Km 7 No. 10, Vistas de la Cantera, 63173, Tepic, Nay.',
};

const moneyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const normalizarFecha = (fecha) => {
  if (!fecha) return '—';
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return String(fecha);
  return date.toLocaleDateString('es-MX');
};

const normalizarMonto = (valor) => Number(valor) || 0;

const convertirNumeroALetra = (num) => {
  const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const centenas = ['ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  const n = Math.floor(Number(num) || 0);
  if (n === 0) return 'cero';
  if (n < 10) return unidades[n];
  if (n < 20) return especiales[n - 10];
  if (n < 100) {
    const decena = Math.floor(n / 10);
    const unidad = n % 10;
    return unidad === 0 ? especiales[decena + 8] : `${especiales[decena + 8]} y ${unidades[unidad]}`;
  }
  if (n < 1000) {
    const centena = Math.floor(n / 100);
    const resto = n % 100;
    return centena === 1 && resto === 0 ? 'cien' : `${centenas[centena - 1]}${resto > 0 ? ` ${convertirNumeroALetra(resto)}` : ''}`;
  }
  if (n < 10000) {
    const miles = Math.floor(n / 1000);
    const resto = n % 1000;
    return `${miles === 1 ? 'mil' : `${convertirNumeroALetra(miles)} mil`}${resto > 0 ? ` ${convertirNumeroALetra(resto)}` : ''}`;
  }
  return String(n);
};

const joinParts = (...parts) => parts.filter((part) => String(part || '').trim().length > 0).join(' ');

const ReciboPagoDocumento = ({
  folio,
  fecha,
  recibiDe,
  concepto,
  nombrePaciente,
  clavePaciente,
  nombreRecibe,
  rfc,
  telefono,
  direccion,
  items = [],
  total = 0,
}) => {
  const totalNumero = normalizarMonto(total);
  const totalLetra = `${convertirNumeroALetra(Math.floor(totalNumero))} pesos con ${String(totalNumero.toFixed(2)).split('.')[1] || '00'} centavos`;
  const itemsVisuales = items.length > 0 ? items : [{ descripcion: concepto || 'Concepto de pago', cantidad: 1, precioUnitario: totalNumero, importe: totalNumero }];

  return (
    <div className="receipt-page">
      <style>{`
        .receipt-page {
          font-family: Inter, Roboto, Geist, 'Segoe UI', sans-serif;
          color: #0f172a;
          background: #ffffff;
          width: 100%;
          padding: 0;
        }

        .receipt-sheet {
          width: min(100%, 8.5in);
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 18px 55px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .receipt-header {
          position: relative;
          background: #ffffff;
        }

        .receipt-accent {
          height: 11px;
          background: #7E1D3B;
        }

        .receipt-header-inner {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.95fr);
          gap: 12px;
          align-items: start;
          padding: 14px 18px 12px;
        }

        .receipt-brand {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          min-width: 0;
        }

        .receipt-logo {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          background: #fff;
          padding: 5px;
          flex-shrink: 0;
        }

        .receipt-brand-text {
          min-width: 0;
        }

        .receipt-kicker {
          margin: 0 0 2px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #7E1D3B;
        }

        .receipt-title {
          margin: 0;
          font-size: 24px;
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .receipt-subtitle {
          margin: 5px 0 0;
          font-size: 11px;
          line-height: 1.35;
          color: #475569;
          max-width: 46ch;
        }

        .receipt-fiscal {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          text-align: right;
        }

        .receipt-fiscal-data {
          font-size: 10px;
          line-height: 1.25;
          color: #334155;
        }

        .receipt-meta-row {
          display: grid;
          grid-template-columns: minmax(108px, 118px) minmax(0, 1fr) minmax(0, 1fr);
          gap: 8px;
          width: 100%;
          align-items: start;
        }

        .receipt-meta-date,
        .receipt-meta-fiscal {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 8px 10px;
          min-width: 0;
        }

        .receipt-meta-date .label,
        .receipt-meta-fiscal .label {
          display: block;
          margin: 0 0 2px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #64748b;
        }

        .receipt-meta-date .value,
        .receipt-meta-fiscal .value {
          font-size: 11px;
          line-height: 1.25;
          color: #0f172a;
          font-weight: 700;
          word-break: break-word;
        }

        .receipt-folio-card {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 10px;
        }

        .receipt-folio-label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #64748b;
        }

        .receipt-folio-value {
          margin-top: 2px;
          font-size: 22px;
          line-height: 1;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
        }

        .receipt-content {
          padding: 0 18px 16px;
        }

        .receipt-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .receipt-field {
          min-width: 0;
        }

        .receipt-field--span-2 {
          grid-column: span 2;
        }

        .receipt-field--span-4 {
          grid-column: 1 / -1;
        }

        .receipt-label {
          display: block;
          margin: 0 0 4px 2px;
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .receipt-value {
          min-height: 38px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 8px 10px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 700;
          color: #0f172a;
          word-break: break-word;
        }

        .receipt-value--large {
          font-size: 13px;
          font-weight: 900;
        }

        .receipt-section {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
        }

        .receipt-section-title {
          margin: 0 0 8px;
          font-size: 11px;
          font-weight: 900;
          color: #7E1D3B;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }

        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .receipt-table thead th {
          background: #7E1D3B;
          color: #ffffff;
          padding: 9px 8px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 900;
          text-align: left;
          border-bottom: 1px solid #6b1831;
        }

        .receipt-table thead th.amount,
        .receipt-table tbody td.amount {
          text-align: right;
        }

        .receipt-table tbody td {
          padding: 9px 8px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12px;
          color: #0f172a;
          vertical-align: top;
        }

        .receipt-table tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        .receipt-table tbody tr:last-child td {
          border-bottom: none;
        }

        .receipt-table .receipt-total-row td {
          background: #fff1f4;
          font-weight: 900;
          color: #7E1D3B;
        }

        .receipt-summary {
          margin-top: 12px;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(190px, 0.85fr);
          gap: 10px;
          align-items: stretch;
        }

        .receipt-words,
        .receipt-number-box {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px;
          background: #ffffff;
        }

        .receipt-words {
          background: linear-gradient(180deg, #ffffff 0%, #fff7f9 100%);
        }

        .receipt-number-box {
          border: 1.5px solid rgba(126, 29, 59, 0.25);
          background: linear-gradient(180deg, rgba(126, 29, 59, 0.08) 0%, rgba(126, 29, 59, 0.04) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100%;
          text-align: center;
        }

        .receipt-words .label,
        .receipt-number-box .label {
          display: block;
          margin-bottom: 4px;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #64748b;
        }

        .receipt-words .value {
          font-size: 13px;
          line-height: 1.35;
          font-weight: 800;
          color: #1e293b;
          text-transform: capitalize;
        }

        .receipt-number-box .value {
          font-size: 24px;
          font-weight: 900;
          line-height: 1;
          color: #7E1D3B;
        }

        .receipt-bottom {
          margin-top: 12px;
          display: grid;
          grid-template-columns: 178px minmax(0, 1fr);
          gap: 10px;
          align-items: stretch;
        }

        .receipt-qr-card,
        .receipt-seal-card,
        .receipt-signature-card {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 12px;
          padding: 10px;
        }

        .receipt-qr-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100%;
        }

        .receipt-panel-title {
          margin: 0;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #64748b;
        }

        .receipt-qr-box {
          margin: 8px auto;
          width: 92px;
          height: 92px;
          border: 1.5px dashed #cbd5e1;
          border-radius: 12px;
          display: grid;
          place-items: center;
          color: #7E1D3B;
          background: linear-gradient(180deg, #ffffff 0%, #fff7f9 100%);
        }

        .receipt-qr-caption {
          margin: 0;
          font-size: 10px;
          line-height: 1.25;
          color: #475569;
          text-align: center;
        }

        .receipt-right-side {
          display: grid;
          grid-template-rows: auto auto;
          gap: 10px;
        }

        .receipt-signatures {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .receipt-signature-card {
          position: relative;
          min-height: 104px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          text-align: center;
          padding-top: 30px;
        }

        .receipt-signature-card::before {
          content: '';
          position: absolute;
          left: 10px;
          right: 10px;
          top: 22px;
          border-top: 2px dotted #94a3b8;
        }

        .receipt-signature-card .label {
          margin: 0 0 6px;
          font-size: 10px;
          font-weight: 900;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .receipt-signature-card .value {
          min-height: 18px;
          font-size: 11px;
          font-weight: 800;
          color: #0f172a;
          word-break: break-word;
        }

        .receipt-seal-card {
          display: grid;
          grid-template-columns: 1fr 92px;
          gap: 10px;
          align-items: center;
        }

        .receipt-seal-box {
          width: 92px;
          height: 92px;
          border: 1.5px dashed #cbd5e1;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #f8fafc;
          color: #94a3b8;
        }

        .receipt-seal-box svg {
          width: 34px;
          height: 34px;
        }

        .receipt-footer {
          margin-top: 10px;
          padding: 0 18px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 10px;
          color: #64748b;
        }

        .receipt-footer-note {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .receipt-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .receipt-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 6px 9px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #475569;
        }

        .receipt-badge svg {
          width: 12px;
          height: 12px;
        }

        @media (max-width: 768px) {
          .receipt-header-inner,
          .receipt-grid,
          .receipt-summary,
          .receipt-bottom,
          .receipt-signatures,
          .receipt-seal-card,
          .receipt-meta-row {
            grid-template-columns: 1fr;
          }

          .receipt-fiscal {
            align-items: flex-start;
            text-align: left;
          }

          .receipt-content,
          .receipt-footer {
            padding-left: 14px;
            padding-right: 14px;
          }

          .receipt-field--span-2 {
            grid-column: auto;
          }
        }

        @media print {
          @page {
            size: letter portrait;
            margin: 6mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .receipt-page {
            background: #ffffff !important;
          }

          .receipt-sheet {
            width: 100%;
            max-width: none;
            border: none;
            box-shadow: none;
            border-radius: 0;
          }

          .receipt-footer,
          .receipt-content {
            padding-left: 0;
            padding-right: 0;
          }

          .print-hidden,
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <article className="receipt-sheet">
        <header className="receipt-header">
          <div className="receipt-accent" />

          <div className="receipt-header-inner">
            <div className="receipt-brand">
              <img className="receipt-logo" src={marakameLogo} alt="Logo Instituto Marakame" />
              <div className="receipt-brand-text">
                <p className="receipt-kicker">Instituto Marakame</p>
                <h1 className="receipt-title">Recibo de Pago</h1>
                <p className="receipt-subtitle">Comprobante administrativo generado para control interno, validación de caja y seguimiento documental.</p>
              </div>
            </div>

            <div className="receipt-fiscal">
              <div className="receipt-meta-row">
                <div className="receipt-meta-date">
                  <span className="label">Fecha</span>
                  <div className="value">
                    <CalendarDays size={12} strokeWidth={2.4} style={{ marginRight: 6, color: '#7E1D3B', flexShrink: 0 }} />
                    {normalizarFecha(fecha)}
                  </div>
                </div>

                <div className="receipt-folio-card" aria-label="Número de recibo">
                  <span className="receipt-folio-label">No. de Recibo</span>
                  <div className="receipt-folio-value">{folio || '—'}</div>
                </div>

                <div className="receipt-meta-fiscal">
                  <span className="label">Datos fiscales</span>
                  <div className="value">
                    <div><strong>RFC:</strong> {FISCAL_DATA.rfc}</div>
                    <div><strong>Dir:</strong> {FISCAL_DATA.domicilio}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="receipt-content">
          <section className="receipt-grid">
            <div className="receipt-field receipt-field--span-2">
              <span className="receipt-label">Recibí de</span>
              <div className="receipt-value receipt-value--large">{recibiDe || '—'}</div>
            </div>

            <div className="receipt-field receipt-field--span-2">
              <span className="receipt-label">PACIENTE / REFERENCIA</span>
              <div className="receipt-value receipt-value--large">{nombrePaciente || '—'}</div>
            </div>

            <div className="receipt-field">
              <span className="receipt-label">Clave</span>
              <div className="receipt-value">{clavePaciente || '—'}</div>
            </div>

            <div className="receipt-field receipt-field--span-2">
              <span className="receipt-label">Concepto</span>
              <div className="receipt-value">{concepto || '—'}</div>
            </div>

            <div className="receipt-field">
              <span className="receipt-label">RFC del pagador</span>
              <div className="receipt-value">{rfc || '—'}</div>
            </div>

            <div className="receipt-field receipt-field--span-2">
              <span className="receipt-label">Teléfono</span>
              <div className="receipt-value">{telefono || '—'}</div>
            </div>

            <div className="receipt-field receipt-field--span-4">
              <span className="receipt-label">Dirección del pagador</span>
              <div className="receipt-value">{direccion || '—'}</div>
            </div>
          </section>

          <section className="receipt-section">
            <p className="receipt-section-title">Tabla de conceptos</p>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th className="amount">Cantidad</th>
                  <th className="amount">Precio unitario</th>
                  <th className="amount">Importe</th>
                </tr>
              </thead>
              <tbody>
                {itemsVisuales.map((item, index) => (
                  <tr key={`${item.descripcion || 'concepto'}-${index}`}>
                    <td>{item.descripcion || '—'}</td>
                    <td className="amount">{item.cantidad ?? 1}</td>
                    <td className="amount">{moneyFormatter.format(normalizarMonto(item.precioUnitario))}</td>
                    <td className="amount">{moneyFormatter.format(normalizarMonto(item.importe))}</td>
                  </tr>
                ))}
                <tr className="receipt-total-row">
                  <td>Total</td>
                  <td className="amount">{itemsVisuales.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0) || 1}</td>
                  <td className="amount" />
                  <td className="amount">{moneyFormatter.format(totalNumero)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="receipt-summary">
            <div className="receipt-words">
              <span className="label">Total en letra</span>
              <div className="value">{totalLetra}</div>
            </div>

            <div className="receipt-number-box">
              <span className="label">Total numérico</span>
              <div className="value">{moneyFormatter.format(totalNumero)}</div>
            </div>
          </section>

          <section className="receipt-bottom">
            <div className="receipt-qr-card">
              <p className="receipt-panel-title">Código QR de validación</p>
              <div className="receipt-qr-box" aria-label="Espacio para QR">
                <QrCode size={56} strokeWidth={1.8} />
              </div>
              <p className="receipt-qr-caption">Espacio reservado para validación digital y consulta rápida del comprobante.</p>
            </div>

            <div className="receipt-right-side">
              <div className="receipt-signatures">
                <div className="receipt-signature-card">
                  <p className="label">Firma de interesado</p>
                  <div className="value">{joinParts(nombreRecibe || recibiDe || '')}</div>
                </div>

                <div className="receipt-signature-card">
                  <p className="label">Firma de caja</p>
                  <div className="value" />
                </div>
              </div>

              <div className="receipt-seal-card">
                <div>
                  <p className="receipt-panel-title">Sello de caja</p>
                  <p className="receipt-qr-caption" style={{ textAlign: 'left', marginTop: 10 }}>Espacio para sello institucional y validación manual de la transacción.</p>
                </div>
                <div className="receipt-seal-box" aria-label="Espacio para sello de caja">
                  <Stamp size={44} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="receipt-footer">
          <div className="receipt-footer-note">
            <Landmark size={12} />
            Documento generado por el sistema Marakame.
          </div>

          <div className="receipt-badges">
            <span className="receipt-badge"><FileText /> Control interno</span>
            <span className="receipt-badge"><Printer /> Listo para impresión</span>
            <span className="receipt-badge"><Hash /> Folio trazable</span>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default ReciboPagoDocumento;