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
  items: InvoiceItemInput[];
  subtotal: number;
  gst: number;
  total: number;
}

export const buildInvoiceHtml = (data: InvoiceHtmlInput): string => {
  const {
    brandName = 'levitation',
    brandSubtitle = 'move',
    invoiceTitle = 'INVOICE GENERATOR',
    invoiceId,
    date,
    clientName,
    items,
    subtotal,
    gst,
    total,
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
      :root { --brand:#7C5DFA; --bg:#0F1217; --card:#FFFFFF; --muted:#6B7280; --text:#0F172A; --success:#22c55e; }
      *{ box-sizing:border-box; }
      body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Noto Sans', 'Helvetica Neue', sans-serif; margin:0; background:#111827; }
      .wrap { padding:24px; display:flex; justify-content:center; }
      .sheet { width:780px; background:#0b0e13; border-radius:8px; padding:16px; }
      .card { background:#fff; border-radius:6px; overflow:hidden; }
      .topbar { background:#0f172a; color:#fff; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; }
      .brand { display:flex; align-items:center; gap:10px; }
      .brand .logo { width:28px; height:28px; background:#fff; color:#000; display:flex; align-items:center; justify-content:center; border-radius:6px; font-weight:700; }
      .brand .text { line-height:1.1; }
      .brand .text .name { font-weight:700; font-size:14px; }
      .brand .text .sub { font-size:10px; opacity:.8; margin-top:2px; }
      .title { font-weight:800; letter-spacing:.8px; font-size:12px; opacity:.9; }
      .meta { background:#0f172a; color:#fff; padding:10px 18px; display:flex; justify-content:space-between; align-items:center; }
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
              <div class="logo">L</div>
              <div class="text">
                <div class="name">${brandName}</div>
                <div class="sub">${brandSubtitle}</div>
              </div>
            </div>
            <div class="title">${invoiceTitle}</div>
          </div>
          <div class="meta">
            <div>
              <div style="color:#9ca3af; font-size:12px;">Client</div>
              <div style="font-weight:700;">${clientName}</div>
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
