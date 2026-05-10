import React from 'react';
import marakameLogo from '../../assets/marakame.jpeg';

const FISCAL = {
  rfc: 'MAR-080325-RRA',
  domicilio: 'Carretera Presa Aguamilpa Km 7 No. 10, Col. Vistas de la Cantera, C.P. 63173, Tepic, Nayarit.',
  telefonos: '211 81 86 y 219 72 63',
};

const MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

const fmtFecha = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
};

const toNum = (v) => Number(v) || 0;

const numALetra = (num) => {
  const u = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const esp = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
    'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const c = ['ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
    'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  const n = Math.floor(Number(num) || 0);
  if (n === 0) return 'cero';
  if (n < 10) return u[n];
  if (n < 20) return esp[n - 10];
  if (n < 100) {
    const d2 = Math.floor(n / 10), r = n % 10;
    return r === 0 ? esp[d2 + 8] : `${esp[d2 + 8]} y ${u[r]}`;
  }
  if (n < 1000) {
    const c2 = Math.floor(n / 100), r = n % 100;
    return c2 === 1 && r === 0 ? 'cien' : `${c[c2 - 1]}${r > 0 ? ` ${numALetra(r)}` : ''}`;
  }
  if (n < 10000) {
    const m = Math.floor(n / 1000), r = n % 1000;
    return `${m === 1 ? 'mil' : `${numALetra(m)} mil`}${r > 0 ? ` ${numALetra(r)}` : ''}`;
  }
  return String(n);
};

const STYLES = `
  * { box-sizing: border-box; }

  .rb-wrap {
    font-family: 'Segoe UI', Inter, Roboto, sans-serif;
    background: #fff;
    color: #0f172a;
    width: 100%;
  }

  .rb {
    width: min(100%, 8in);
    margin: 0 auto;
    background: #fff;
    border: 1.5px solid #cbd5e1;
    box-shadow: 0 12px 40px rgba(15,23,42,.10);
    overflow: hidden;
  }

  /* ── HEADER ─────────────────────────────────── */
  .rb-bar {
    height: 10px;
    background: #7E1D3B;
  }

  .rb-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 18px 12px;
    border-bottom: 1.5px solid #e2e8f0;
    background: #fff;
  }

  .rb-brand {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .rb-logo {
    width: 62px;
    height: 62px;
    object-fit: cover;
    border-radius: 14px;
    border: 1.5px solid #e2e8f0;
    padding: 4px;
    flex-shrink: 0;
  }

  .rb-inst {
    min-width: 0;
  }

  .rb-inst-sub {
    margin: 0 0 1px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #7E1D3B;
  }

  .rb-inst-name {
    margin: 0 0 4px;
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -.02em;
    color: #0f172a;
  }

  .rb-inst-line {
    margin: 0;
    font-size: 10.5px;
    color: #475569;
    line-height: 1.45;
  }

  .rb-folio {
    flex-shrink: 0;
    border: 2px solid #7E1D3B;
    border-radius: 14px;
    padding: 10px 18px 12px;
    text-align: center;
    min-width: 110px;
  }

  .rb-folio-title {
    display: block;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #7E1D3B;
    margin-bottom: 2px;
  }

  .rb-folio-sep {
    display: block;
    font-size: 10px;
    color: #94a3b8;
    margin-bottom: 4px;
    letter-spacing: .12em;
  }

  .rb-folio-num {
    display: block;
    font-size: 26px;
    font-weight: 900;
    letter-spacing: -.03em;
    color: #7E1D3B;
    line-height: 1;
  }

  /* ── BODY ────────────────────────────────────── */
  .rb-body {
    padding: 0 18px 16px;
  }

  .rb-divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 12px 0;
  }

  /* Field row */
  .rb-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
    margin-bottom: 8px;
  }

  .rb-f {
    display: flex;
    align-items: baseline;
    gap: 6px;
    border-bottom: 1.5px solid #cbd5e1;
    padding: 6px 4px 5px;
    min-width: 0;
  }

  .rb-f--grow { flex: 1 1 0; min-width: 0; }
  .rb-f--fixed-sm { flex: 0 0 100px; }
  .rb-f--fixed-md { flex: 0 0 160px; }

  .rb-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #7E1D3B;
    color: #fff;
    font-size: 9px;
    font-weight: 900;
    flex-shrink: 0;
    line-height: 1;
  }

  .rb-lbl {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .12em;
    color: #64748b;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .rb-val {
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    flex: 1;
    word-break: break-word;
  }

  .rb-val--lg {
    font-size: 13px;
    font-weight: 800;
  }

  /* ── CONCEPTO + PAGOS ────────────────────────── */
  .rb-mid {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 0;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .rb-concepto {
    padding: 12px 14px;
    border-right: 1.5px solid #e2e8f0;
  }

  .rb-concepto-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .rb-concepto-lbl {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .18em;
    color: #7E1D3B;
  }

  .rb-concepto-val {
    font-size: 12.5px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.45;
    min-height: 64px;
  }

  .rb-pagos {
    padding: 12px 14px;
    background: #fdf2f5;
  }

  .rb-pagos-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }

  .rb-pagos-lbl {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .18em;
    color: #7E1D3B;
  }

  .rb-pago-item {
    margin-bottom: 8px;
  }

  .rb-pago-item-lbl {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .12em;
    color: #94a3b8;
    margin-bottom: 2px;
  }

  .rb-pago-item-val {
    display: block;
    font-size: 15px;
    font-weight: 900;
    color: #7E1D3B;
    letter-spacing: -.02em;
  }

  .rb-pago-item-empty {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #cbd5e1;
  }

  /* ── TOTAL ROW ───────────────────────────────── */
  .rb-total-row {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 8px;
    align-items: stretch;
    margin-bottom: 8px;
  }

  .rb-letra-box {
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 10px 14px;
    background: #f8fafc;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .rb-letra-content {
    min-width: 0;
    flex: 1;
  }

  .rb-letra-label {
    display: block;
    font-size: 9.5px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .18em;
    color: #64748b;
    margin-bottom: 4px;
  }

  .rb-letra-val {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.4;
    text-transform: capitalize;
  }

  .rb-total-box {
    border: 2px solid #7E1D3B;
    border-radius: 14px;
    padding: 10px 14px;
    background: #7E1D3B;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .rb-total-label {
    display: block;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: rgba(255,255,255,.75);
    margin-bottom: 4px;
  }

  .rb-total-num {
    display: block;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -.03em;
    color: #fff;
    line-height: 1;
  }

  /* ── FIRMAS ──────────────────────────────────── */
  .rb-sigs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1.5px solid #e2e8f0;
  }

  .rb-sig {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10px 8px 8px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    background: #f8fafc;
  }

  .rb-sig-space {
    width: 100%;
    height: 52px;
    border-bottom: 2px dotted #94a3b8;
    margin-bottom: 8px;
  }

  .rb-sig-num-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .rb-sig-name {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .14em;
    color: #334155;
  }

  .rb-sig-role {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .16em;
    color: #7E1D3B;
  }

  /* ── FOOTER ──────────────────────────────────── */
  .rb-foot {
    padding: 8px 18px 12px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 9.5px;
    color: #94a3b8;
  }

  /* ── PRINT ───────────────────────────────────── */
  @media print {
    @page { size: letter portrait; margin: 6mm; }
    html, body { margin: 0 !important; padding: 0 !important; background: #fff !important;
      -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .rb-wrap { background: #fff !important; }
    .rb { width: 100%; max-width: none; border: none; box-shadow: none; border-radius: 0; }
    .rb-foot { padding-left: 0; padding-right: 0; }
    .no-print { display: none !important; }
  }

  @media (max-width: 640px) {
    .rb-head { flex-direction: column; }
    .rb-folio { align-self: flex-start; }
    .rb-mid { grid-template-columns: 1fr; }
    .rb-concepto { border-right: none; border-bottom: 1.5px solid #e2e8f0; }
    .rb-total-row { grid-template-columns: 1fr; }
    .rb-sigs { grid-template-columns: 1fr; }
    .rb-row { flex-direction: column; }
    .rb-f--fixed-sm, .rb-f--fixed-md { flex: 1 1 0; }
  }
`;

const Num = ({ n }) => (
  <span className="rb-num">{n}</span>
);

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
  const totalNum = toNum(total);
  const centavos = String(totalNum.toFixed(2)).split('.')[1] || '00';
  const totalLetra = `${numALetra(Math.floor(totalNum))} pesos ${centavos}/100 M.N.`;

  const montoTratamiento = items.find((i) => /tratamiento/i.test(i.descripcion))?.importe || 0;
  const montoPrograma    = items.find((i) => /programa/i.test(i.descripcion))?.importe || 0;

  return (
    <div className="rb-wrap">
      <style>{STYLES}</style>

      <div className="rb">
        {/* ── BAR ── */}
        <div className="rb-bar" />

        {/* ── HEADER ── */}
        <header className="rb-head">
          <div className="rb-brand">
            <img className="rb-logo" src={marakameLogo} alt="Logo Instituto Marakame" />
            <div className="rb-inst">
              <p className="rb-inst-sub">Instituto Marakame</p>
              <p className="rb-inst-name">INSTITUTO MARAKAME</p>
              <p className="rb-inst-line">R.F.C. {FISCAL.rfc}</p>
              <p className="rb-inst-line">{FISCAL.domicilio}</p>
              <p className="rb-inst-line">Teléfonos: {FISCAL.telefonos}, Tepic, Nayarit.</p>
            </div>
          </div>

          <div className="rb-folio" aria-label="Número de recibo">
            <span className="rb-folio-title">Recibo</span>
            <span className="rb-folio-sep">Nº</span>
            <span className="rb-folio-num">{folio || '—'}</span>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="rb-body">
          {/* Fila 1 – NOMBRE + FECHA */}
          <div className="rb-row" style={{ marginTop: 14 }}>
            <div className="rb-f rb-f--grow">
              <Num n={1} />
              <span className="rb-lbl">Nombre:</span>
              <span className="rb-val rb-val--lg">{recibiDe || '—'}</span>
            </div>
            <div className="rb-f rb-f--fixed-md">
              <Num n={2} />
              <span className="rb-lbl">Fecha:</span>
              <span className="rb-val">{fmtFecha(fecha)}</span>
            </div>
          </div>

          {/* Fila 2 – DOMICILIO */}
          <div className="rb-row">
            <div className="rb-f rb-f--grow">
              <Num n={3} />
              <span className="rb-lbl">Domicilio:</span>
              <span className="rb-val">{direccion || '—'}</span>
            </div>
          </div>

          {/* Fila 3 – RFC + TEL */}
          <div className="rb-row">
            <div className="rb-f rb-f--grow">
              <Num n={5} />
              <span className="rb-lbl">R.F.C.:</span>
              <span className="rb-val">{rfc || '—'}</span>
            </div>
            <div className="rb-f rb-f--fixed-md">
              <Num n={6} />
              <span className="rb-lbl">Tel.:</span>
              <span className="rb-val">{telefono || '—'}</span>
            </div>
          </div>

          {/* Fila 4 – NOMBRE DEL PACIENTE + CLAVE */}
          <div className="rb-row">
            <div className="rb-f rb-f--grow">
              <Num n={7} />
              <span className="rb-lbl">Nombre del paciente:</span>
              <span className="rb-val rb-val--lg">{nombrePaciente || '—'}</span>
            </div>
            <div className="rb-f rb-f--fixed-sm">
              <Num n={8} />
              <span className="rb-lbl">Clave:</span>
              <span className="rb-val">{clavePaciente || '—'}</span>
            </div>
          </div>

          <hr className="rb-divider" />

          {/* Fila 5 – CONCEPTO | PAGOS */}
          <div className="rb-mid">
            <div className="rb-concepto">
              <div className="rb-concepto-head">
                <Num n={9} />
                <span className="rb-concepto-lbl">Concepto:</span>
              </div>
              <p className="rb-concepto-val">{concepto || '—'}</p>
            </div>

            <div className="rb-pagos">
              <div className="rb-pagos-head">
                <Num n={10} />
                <span className="rb-pagos-lbl">Pagos:</span>
              </div>

              <div className="rb-pago-item">
                <span className="rb-pago-item-lbl">Tratamiento</span>
                {montoTratamiento > 0
                  ? <span className="rb-pago-item-val">{MXN.format(montoTratamiento)}</span>
                  : <span className="rb-pago-item-empty">—</span>}
              </div>

              <div className="rb-pago-item">
                <span className="rb-pago-item-lbl">Programa familiar</span>
                {montoPrograma > 0
                  ? <span className="rb-pago-item-val">{MXN.format(montoPrograma)}</span>
                  : <span className="rb-pago-item-empty">—</span>}
              </div>
            </div>
          </div>

          {/* Fila 6 – LETRA + TOTAL */}
          <div className="rb-total-row">
            <div className="rb-letra-box">
              <Num n={11} />
              <div className="rb-letra-content">
                <span className="rb-letra-label">Cantidad con letra:</span>
                <span className="rb-letra-val">{totalLetra}</span>
              </div>
            </div>

            <div className="rb-total-box">
              <span className="rb-total-label">
                <span style={{ fontSize: 9 }}>⑫</span> Total
              </span>
              <span className="rb-total-num">{MXN.format(totalNum)}</span>
            </div>
          </div>

          {/* Firmas */}
          <div className="rb-sigs">
            <div className="rb-sig">
              <div className="rb-sig-space" />
              <div className="rb-sig-num-wrap">
                <Num n={13} />
                <span className="rb-sig-name">Nombre y Firma</span>
              </div>
              <span className="rb-sig-role">Responsable de Admisiones</span>
            </div>

            <div className="rb-sig">
              <div className="rb-sig-space" />
              <div className="rb-sig-num-wrap">
                <Num n={14} />
                <span className="rb-sig-name">Nombre y Firma</span>
              </div>
              <span className="rb-sig-role">Aval</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="rb-foot">
          <span>Documento generado por el Sistema Integral Marakame.</span>
          <span>Control interno · Folio trazable</span>
        </footer>
      </div>
    </div>
  );
};

export default ReciboPagoDocumento;
