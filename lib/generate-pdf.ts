// lib/generate-pdf.ts
// Generates a branded print-ready PDF quote using browser window.print()
// with a full watermark overlay (logo, date, client name, quote ID)

export interface QuoteLineItem {
  sku?: string
  productId?: string
  name: string
  qty: number
  unitPrice?: number
  price?: number
  unit?: string
}

export interface QuotePDFOptions {
  quoteId: string
  clientName: string
  eventTitle: string
  eventDate?: string
  location?: string
  notes?: string
  items: QuoteLineItem[]
}

function currencyMXN(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n)
}

export function generateQuotePDF(opts: QuotePDFOptions) {
  const { quoteId, clientName, eventTitle, eventDate, location, notes, items } = opts

  const today = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const subtotal = items.reduce((s, li) => {
    const price = li.unitPrice ?? li.price ?? 0
    return s + li.qty * price
  }, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva
  const deposit = total * 0.5
  const balance = total - deposit

  const itemRows = items
    .map((li) => {
      const price = li.unitPrice ?? li.price ?? 0
      const lineTotal = li.qty * price
      const sku = li.sku ?? li.productId ?? ""
      return `
        <tr>
          <td class="td-sku">${sku}</td>
          <td class="td-name">${li.name}${li.unit ? ` <span class="unit">(${li.unit})</span>` : ""}</td>
          <td class="td-num">${li.qty}</td>
          <td class="td-num">${currencyMXN(price)}</td>
          <td class="td-num td-bold">${currencyMXN(lineTotal)}</td>
        </tr>`
    })
    .join("")

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Cotización ${quoteId} — ${clientName}</title>
  <style>
    /* ─── Reset ─────────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ─── Page setup ─────────────────────────────────────────── */
    @page {
      size: Letter;
      margin: 18mm 16mm 22mm 16mm;
    }

    html, body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 11px;
      color: #1a1a2e;
      background: #fff;
    }

    /* ─── WATERMARK ──────────────────────────────────────────── */
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      width: 420px;
      opacity: 0.045;
      pointer-events: none;
      z-index: 0;
    }

    .watermark-logo {
      width: 100%;
      display: block;
      filter: grayscale(1);
    }

    /* ─── HEADER ─────────────────────────────────────────────── */
    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #f59e0b;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }

    .doc-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .doc-logo {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 10px;
    }

    .doc-brand-name {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #1a1a2e;
    }

    .doc-brand-sub {
      font-size: 10px;
      color: #888;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .doc-header-right {
      text-align: right;
    }

    .doc-quote-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #888;
    }

    .doc-quote-id {
      font-size: 20px;
      font-weight: 900;
      color: #f59e0b;
      letter-spacing: -0.5px;
    }

    .doc-quote-date {
      font-size: 9px;
      color: #888;
      margin-top: 2px;
    }

    /* ─── META SECTION ──────────────────────────────────────── */
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .meta-card {
      background: #f8f8fa;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 12px 14px;
    }

    .meta-label {
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #aaa;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 12px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .meta-value-sub {
      font-size: 10px;
      color: #666;
      margin-top: 2px;
    }

    /* ─── ITEMS TABLE ─────────────────────────────────────────── */
    .section-title {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #f59e0b;
      margin-bottom: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    thead th {
      background: #1a1a2e;
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 8px 10px;
      text-align: left;
    }

    thead th:first-child { border-radius: 6px 0 0 6px; }
    thead th:last-child  { border-radius: 0 6px 6px 0; }

    tbody tr:nth-child(even) { background: #f9f9fb; }
    tbody tr:nth-child(odd)  { background: #fff; }

    td {
      padding: 7px 10px;
      vertical-align: middle;
      border-bottom: 1px solid #f0f0f5;
      font-size: 10.5px;
      color: #333;
    }

    .td-sku   { font-family: monospace; font-size: 9px; color: #aaa; white-space: nowrap; }
    .td-name  { min-width: 160px; font-weight: 600; }
    .td-num   { text-align: right; white-space: nowrap; }
    .td-bold  { font-weight: 800; color: #1a1a2e; }
    .unit     { font-size: 9px; color: #aaa; font-weight: 400; }

    /* ─── TOTALS ──────────────────────────────────────────────── */
    .totals-wrap {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    .totals-box {
      background: #f8f8fa;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 14px 20px;
      min-width: 260px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      font-size: 11px;
      color: #555;
    }

    .totals-row.divider {
      border-top: 1px solid #e5e7eb;
      margin-top: 6px;
      padding-top: 8px;
    }

    .totals-row.total-main .tot-label {
      font-size: 13px;
      font-weight: 900;
      color: #1a1a2e;
    }

    .totals-row.total-main .tot-value {
      font-size: 18px;
      font-weight: 900;
      color: #1a1a2e;
    }

    .totals-row.deposit .tot-value {
      font-weight: 800;
      color: #f59e0b;
    }

    /* ─── NOTES ──────────────────────────────────────────────── */
    .notes-box {
      background: #fffdf5;
      border: 1px solid #fde68a;
      border-left: 4px solid #f59e0b;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 20px;
      font-size: 10px;
      color: #555;
    }

    /* ─── FOOTER ─────────────────────────────────────────────── */
    .doc-footer {
      position: fixed;
      bottom: 8mm;
      left: 0;
      right: 0;
      padding: 0 16mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e5e7eb;
      padding-top: 6px;
    }

    .footer-left {
      font-size: 8px;
      color: #bbb;
    }

    .footer-center {
      font-size: 8px;
      color: #bbb;
      text-align: center;
    }

    .footer-right {
      font-size: 8px;
      color: #bbb;
      text-align: right;
    }

    .footer-quote-badge {
      display: inline-block;
      background: #1a1a2e;
      color: #f59e0b;
      font-size: 7px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 20px;
    }

    /* ─── PRINT-ONLY: hide on screen ────────────────────────── */
    @media screen {
      body { background: #e5e7eb; padding: 20px; }
      .page { background: #fff; max-width: 816px; margin: 0 auto; padding: 40px; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
    }

    @media print {
      .page { padding: 0; }
    }
  </style>
</head>
<body>
  <!-- Watermark: rendered behind everything -->
  <div class="watermark" aria-hidden="true">
    <img class="watermark-logo" src="/images/e360-logo.jpg" alt="" />
  </div>

  <div class="page">
    <!-- ── Header ─────────────────────────────────── -->
    <div class="doc-header">
      <div class="doc-header-left">
        <img class="doc-logo" src="/images/e360-logo.jpg" alt="Eventos 360 Logo" />
        <div>
          <div class="doc-brand-name">Eventos 360</div>
          <div class="doc-brand-sub">Producción de eventos integral</div>
        </div>
      </div>
      <div class="doc-header-right">
        <div class="doc-quote-label">Cotización</div>
        <div class="doc-quote-id">${quoteId}</div>
        <div class="doc-quote-date">Emitida el ${today}</div>
      </div>
    </div>

    <!-- ── Meta ──────────────────────────────────── -->
    <div class="meta-grid">
      <div class="meta-card">
        <div class="meta-label">Cliente / Prospecto</div>
        <div class="meta-value">${clientName}</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">Evento</div>
        <div class="meta-value">${eventTitle}</div>
        ${eventDate ? `<div class="meta-value-sub">${eventDate}${location ? ` &bull; ${location}` : ""}</div>` : ""}
      </div>
    </div>

    <!-- ── Items ──────────────────────────────────── -->
    <div class="section-title">Detalle de servicios</div>
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Descripción</th>
          <th style="text-align:right">Cant.</th>
          <th style="text-align:right">P. Unit.</th>
          <th style="text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows || `<tr><td colspan="5" style="text-align:center;color:#aaa;padding:20px">Sin items</td></tr>`}
      </tbody>
    </table>

    <!-- ── Totals ─────────────────────────────────── -->
    <div class="totals-wrap">
      <div class="totals-box">
        <div class="totals-row">
          <span class="tot-label">Subtotal</span>
          <span class="tot-value">${currencyMXN(subtotal)}</span>
        </div>
        <div class="totals-row">
          <span class="tot-label">IVA (16%)</span>
          <span class="tot-value">${currencyMXN(iva)}</span>
        </div>
        <div class="totals-row divider total-main">
          <span class="tot-label">Total</span>
          <span class="tot-value">${currencyMXN(total)}</span>
        </div>
        <div class="totals-row deposit">
          <span class="tot-label">Anticipo (50%)</span>
          <span class="tot-value">${currencyMXN(deposit)}</span>
        </div>
        <div class="totals-row">
          <span class="tot-label">Saldo</span>
          <span class="tot-value">${currencyMXN(balance)}</span>
        </div>
      </div>
    </div>

    ${notes ? `<div class="notes-box"><strong>Notas:</strong> ${notes}</div>` : ""}

    <!-- ── Footer ─────────────────────────────────── -->
    <div class="doc-footer">
      <div class="footer-left">Eventos 360 &mdash; Producción integral de eventos</div>
      <div class="footer-center">
        <span class="footer-quote-badge">${quoteId}</span>
        &nbsp;&bull;&nbsp; ${clientName} &nbsp;&bull;&nbsp; ${today}
      </div>
      <div class="footer-right">Página 1</div>
    </div>
  </div>

  <script>
    window.onload = function () { window.print(); };
  </script>
</body>
</html>`

  // Open in a new tab and trigger print
  const win = window.open("", "_blank", "width=900,height=700")
  if (!win) {
    alert("Activa las ventanas emergentes para generar el PDF.")
    return
  }
  win.document.write(html)
  win.document.close()
}
