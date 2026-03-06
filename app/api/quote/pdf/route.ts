import { NextRequest, NextResponse } from "next/server"

interface CartItem {
  item: {
    id: string
    name: string
    priceValue: number
    unit: string
    category: string
    description: string
  }
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const { items, total } = await request.json() as { items: CartItem[]; total: number }

    // Generate HTML for PDF
    const html = generateQuoteHTML(items, total)

    // Return HTML that can be printed as PDF
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": 'attachment; filename="cotizacion-eventos360.html"',
      },
    })
  } catch (error) {
    console.error("Error generating quote:", error)
    return NextResponse.json({ error: "Error generating quote" }, { status: 500 })
  }
}

function generateQuoteHTML(items: CartItem[], total: number): string {
  const today = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const quoteNumber = `E360-${Date.now().toString(36).toUpperCase()}`

  const itemRows = items
    .map(
      (c) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${c.item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${c.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${c.item.priceValue.toLocaleString()}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">$${(c.item.priceValue * c.quantity).toLocaleString()}</td>
      </tr>
    `
    )
    .join("")

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotizacion ${quoteNumber} - Eventos 360</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: white;
      min-height: 100vh;
      position: relative;
    }
    
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 120px;
      font-weight: 800;
      color: rgba(214, 180, 107, 0.08);
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
    }
    
    .content {
      position: relative;
      z-index: 1;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 2px solid #d6b46b;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .logo-circle {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #d6b46b, #c4a356);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 24px;
    }
    
    .company-name {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    
    .company-tagline {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    
    .quote-info {
      text-align: right;
    }
    
    .quote-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #d6b46b;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .quote-number {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
    }
    
    .quote-date {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    
    .section-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #d6b46b;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    
    .items-table th {
      background: #f8fafc;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      font-weight: 600;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .items-table th:nth-child(2),
    .items-table th:nth-child(3),
    .items-table th:nth-child(4) {
      text-align: center;
    }
    
    .items-table th:last-child {
      text-align: right;
    }
    
    .items-table td {
      font-size: 14px;
    }
    
    .total-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    
    .total-box {
      background: linear-gradient(135deg, #d6b46b, #c4a356);
      padding: 20px 32px;
      border-radius: 12px;
      color: white;
    }
    
    .total-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.9;
    }
    
    .total-amount {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .contact-item {
      text-align: center;
    }
    
    .contact-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    .contact-value {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }
    
    .terms {
      font-size: 11px;
      color: #64748b;
      text-align: center;
      line-height: 1.6;
    }
    
    .terms strong {
      color: #0f172a;
    }
    
    @media print {
      body {
        background: white;
      }
      .container {
        padding: 20px;
      }
      .watermark {
        font-size: 80px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="watermark">EVENTOS 360</div>
    
    <div class="content">
      <header class="header">
        <div class="logo-section">
          <div class="logo-circle">E3</div>
          <div>
            <div class="company-name">EVENTOS 360</div>
            <div class="company-tagline">Produccion de eventos, logistica, gestion y tecnica</div>
          </div>
        </div>
        <div class="quote-info">
          <div class="quote-title">Cotizacion</div>
          <div class="quote-number">${quoteNumber}</div>
          <div class="quote-date">${today}</div>
        </div>
      </header>
      
      <section>
        <h2 class="section-title">Productos y Servicios</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>Cant.</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
      </section>
      
      <div class="total-section">
        <div class="total-box">
          <div class="total-label">Total Estimado</div>
          <div class="total-amount">$${total.toLocaleString()} MXN</div>
        </div>
      </div>
      
      <footer class="footer">
        <div class="contact-grid">
          <div class="contact-item">
            <div class="contact-label">Telefono</div>
            <div class="contact-value">442-795-3753</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Email</div>
            <div class="contact-value">Proyectos360.qro@gmail.com</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Instagram</div>
            <div class="contact-value">@eventos_360_qro</div>
          </div>
        </div>
        
        <div class="terms">
          <strong>Nota:</strong> Esta cotizacion es valida por 15 dias a partir de la fecha de emision. 
          Los precios pueden variar si el evento es fuera del cuadro de Queretaro (costo extra de traslado). 
          Para confirmar su reservacion, favor de contactarnos por WhatsApp o email.
        </div>
      </footer>
    </div>
  </div>
  
  <script>
    // Auto-print when opened
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
  `
}
