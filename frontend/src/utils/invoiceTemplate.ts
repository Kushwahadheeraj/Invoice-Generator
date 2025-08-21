export interface InvoiceItemInput {
  name: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface InvoiceHtmlInput {
  brandName?: string;
  brandSubtitle?: string;
  invoiceTitle?: string;
  invoiceId: string;
  date: string;
  clientName: string;
  clientEmail?: string;
  items: InvoiceItemInput[];
  subtotal: number;
  gst: number;
  total: number;
  logoDataUrl?: string;
}

export const buildInvoiceHtml = (data: InvoiceHtmlInput): string => {
  const {
    invoiceTitle = 'INVOICE GENERATOR',
    date,
    clientName,
    clientEmail,
    items,
    subtotal,
    gst,
    total,
    logoDataUrl = ''
  } = data;

  const rows = items
    .map(
      (it) => `
        <tr>
          <td>${it.name}</td>
          <td>${it.rate}</td>
          <td>${it.quantity}</td>
          <td>INR ${it.total.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Invoice</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300&display=swap');
      
      :root { --brand:#7C5DFA; --bg:#0F1217; --card:#FFFFFF; --muted:#6B7280; --text:#0F172A; --success:#22c55e; }
      *{ box-sizing:border-box; }
      body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Noto Sans', 'Helvetica Neue', sans-serif; margin:0; background:#111827; }
      .wrap { padding:24px; display:flex; justify-content:center; }
      .sheet { width:780px; background:#0b0e13; border-radius:8px; padding:16px; }
      .card { background:#fff; border-radius:6px; overflow:hidden; }
      
      .topbar { 
        width: 593.5px;
        height: 64px;
        background:#ffffff; 
        color:#000000; 
        padding:0; 
        display:flex; 
        align-items:center; 
        justify-content:space-between;
        position: relative;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .brand { 
        display:flex; 
        align-items:center; 
        gap:4.56px;
        width: 114.86795043945312px;
        height: 36.9180908203125px;
        position: absolute;
        top: 14.5px;
        left: 23px;
      }
      
      .brand .logo { 
        width: 114.86795043945312px;
        height: 36.9180908203125px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .brand .logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      
      .brand .text { 
        line-height:1.1; 
        display: flex;
        flex-direction: column;
        gap: 4.53px;
         top: 18.5px;
      }
      
      .brand .text .name { 
        font-family: 'Pretendard', sans-serif;
        font-weight: 300;
        font-style: Light;
        font-size: 17.31px;
        line-height: 160%;
        letter-spacing: 0%;
        color: #000000;
        width: 75px;
        height: 36.9180908203125px;
        margin: 0;
      }
      
      .brand .text .sub { 
        font-family: 'Pretendard', sans-serif;
        font-weight: 300;
        font-style: Light;
        font-size: 6.49px;
        line-height: 160%;
        letter-spacing: 0%;
        color: #6b7280;
        margin: 0;
      }
      
      .title { 
        font-weight:800; 
        letter-spacing:.8px; 
        font-size:12px; 
        opacity:.9;
        width: 187px;
        height: 40.417724609375px;
        position: absolute;
        top: 14.5px;
        left: 407px;
        gap: 3px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
      }
      
      .title h2 {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        color: #000000;
      }
      
      .title p {
        font-size: 10px;
        color: #6b7280;
        margin: 0;
        margin-top: 2px;
      }
      
      .meta { background:#0f172a; color:#fff; top: 96px; padding:10px 18px; display:flex; justify-content:space-between; align-items:center; }
      .nameRow { display:flex; align-items:center; gap:12px; }
      .email-pill { background:#0c1220; border:1px solid #223049; color:#e5e7eb; padding:6px 12px; border-radius:999px; font-size:12px; }
      .chip { background:#16a34a; color:#fff; padding:6px 12px; border-radius:999px; font-size:12px; font-weight:600; display:inline-block; }
      table { width:100%; border-collapse:collapse; }
      thead th { text-align:left; padding:12px 16px; color:#111827; font-weight:700; font-size:13px; background:#f7f7fb; }
      tbody td { padding:12px 16px; color:#111827; font-size:13px; }
      tbody tr:nth-child(even) { background:#fafafa; }
      .summary { padding:16px; display:flex; justify-content:flex-end; }
      .summary-card { width:260px; border:1px solid #e5e7eb; border-radius:8px; padding:16px; }
      .row { display:flex; justify-content:space-between; color:#4b5563; font-size:13px; margin:6px 0; }
      .row.total { color:#111827; font-weight:700; margin-top:10px; }
      .footer { padding:16px; display:flex; justify-content:center; }
      .note { background:#111827; color:#e5e7eb; font-size:11px; padding:10px 16px; border-radius:999px; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="sheet">
        <div class="card">
          <div class="topbar">
            <div class="brand">
              <div class="logo">
                ${logoDataUrl ? `<img src="${logoDataUrl}" alt="Logo" />` : ''}
              </div>
            </div>
            <div class="title">
              <h2>${invoiceTitle}</h2>
              <p>Sample Output should be this</p>
            </div>
          </div>
          <div class="meta">
            <div>
              <div style="color:#9ca3af; font-size:12px;">Name</div>
              <div class="nameRow">
                <div style="font-weight:700;">${clientName}</div>
                ${clientEmail ? `<span class="email-pill">${clientEmail}</span>` : ''}
              </div>
            </div>
            <div>
              <div style="color:#9ca3af; font-size:12px;">Date</div>
              <div style="font-weight:700;">${date}</div>
            </div>
          </div>
          <div style="padding:16px 16px 0 16px;">
            <span class="chip">Paid</span>
          </div>
          <div style="padding:8px 16px 16px 16px;">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
          <div class="summary">
            <div class="summary-card">
              <div class="row"><span>Sub Total</span><span>INR ${subtotal.toFixed(2)}</span></div>
              <div class="row"><span>Inc + GST 18%</span><span>INR ${gst.toFixed(2)}</span></div>
              <div class="row total"><span>Total Amount</span><span>INR ${total.toFixed(2)}</span></div>
            </div>
          </div>
          <div class="footer">
            <div class="note">This is a system generated invoice and does not require a signature.</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`; 
};
