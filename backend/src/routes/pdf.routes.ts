import { Router } from 'express';
import puppeteer from 'puppeteer';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { html, options = {} } = req.body;
    if (!html) return res.status(400).json({ error: 'HTML is required' });

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: options.format || 'A4',
      printBackground: true,
      margin: options.margin || { top: '16mm', right: '12mm', bottom: '16mm', left: '12mm' },
      ...options,
    });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;


