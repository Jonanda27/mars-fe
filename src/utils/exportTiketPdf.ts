/**
 * Utilitas ekspor dokumen PDF resmi menggunakan html2canvas-pro dan jsPDF.
 * Mendukung warna modern Tailwind CSS v4 (lab, oklch, oklab) tanpa error.
 */
export async function generateTiketPdf(
  element: HTMLElement,
  filename: string = 'Tiket_Izin_Masuk_Hanggar.pdf',
  options?: {
    returnBlob?: boolean;
    autoDownload?: boolean;
  }
): Promise<{ blob?: Blob; success: boolean }> {
  const autoDownload = options?.autoDownload !== false;
  const returnBlob = options?.returnBlob === true;

  // Temukan elemen lembar A4 jika ada untuk merapikan shadow/border saat di-render
  const pageA4 = element.querySelector('.page-a4') as HTMLElement | null;
  const originalShadow = pageA4 ? pageA4.style.boxShadow : '';
  const originalBorder = pageA4 ? pageA4.style.border : '';

  try {
    if (pageA4) {
      pageA4.style.boxShadow = 'none';
      pageA4.style.border = 'none';
    }

    // Dynamic import untuk kompatibilitas Next.js SSR
    const html2canvas = (await import('html2canvas-pro')).default;
    const { jsPDF } = await import('jspdf');

    // Render DOM ke canvas beresolusi tinggi (scale 2 untuk hasil cetak tajam)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Inisialisasi dokumen jsPDF ukuran A4 portrait (210 x 297 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

    let outputBlob: Blob | undefined;
    if (returnBlob) {
      outputBlob = pdf.output('blob');
    }

    if (autoDownload) {
      pdf.save(filename);
    }

    return { blob: outputBlob, success: true };
  } catch (error) {
    console.error('Gagal generate tiket PDF:', error);
    throw error;
  } finally {
    // Kembalikan styling asli tampilan layar
    if (pageA4) {
      pageA4.style.boxShadow = originalShadow;
      pageA4.style.border = originalBorder;
    }
  }
}
