import api, { endpoints } from './api';

export interface PDFGenerationData {
  html: string;
  options?: {
    format?: 'A4' | 'Letter';
    margin?: { top: string; right: string; bottom: string; left: string };
  };
}

export const pdfService = {
  async generatePDF(data: PDFGenerationData): Promise<Blob> {
    try {
      const response = await api.post(endpoints.pdf.generate, data, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate PDF');
    }
  },

  async downloadPDF(data: PDFGenerationData, filename = 'invoice.pdf'): Promise<void> {
    try {
      const blob = await this.generatePDF(data);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to download PDF');
    }
  },
};
