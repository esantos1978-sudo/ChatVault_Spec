/**
 * Extrae texto de un archivo PDF usando pdfjs-dist.
 * Esta función se importa dinámicamente para evitar que Webpack
 * resuelva dependencias nativas (canvas) durante el build.
 */
export async function extractPdfText(file: File): Promise<string> {
  // ✅ Asegurar que solo se ejecuta en el navegador
  if (typeof window === "undefined") {
    throw new Error("PDF extraction is only supported in the browser");
  }

  // ✅ CARGA DINÁMICA: Usamos la versión legacy (ES module) que está
  // diseñada específicamente para navegadores y no tiene dependencias
  // nativas como 'canvas'. La versión principal (build/pdf.js) incluye
  // código para Node.js que requiere 'canvas'.
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js");

  // ✅ CONFIGURAR EL WORKER CON CDN (evita dependencias nativas)
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
}
