import { Router } from 'express';
import puppeteer from 'puppeteer';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { html, options = {} } = req.body;
    if (!html) return res.status(400).json({ error: 'HTML is required' });

    // Production-optimized Puppeteer configuration for Render
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent PDF generation
    await page.setViewport({ width: 1200, height: 800 });
    
    // Set content with proper wait strategy
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Generate PDF with optimized settings
    const pdf = await page.pdf({
      format: options.format || 'A4',
      printBackground: true,
      margin: options.margin || { top: '16mm', right: '12mm', bottom: '16mm', left: '12mm' },
      preferCSSPageSize: true,
      ...options,
    });
    
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    res.send(pdf);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Health check for PDF service
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'PDF Generator',
    timestamp: new Date().toISOString() 
  });
});

export default router;


