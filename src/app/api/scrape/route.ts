import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Falta la URL" }, { status: 400 });
    }

    // Nombres por defecto estéticos según la plataforma
    let defaultTitle = "Enlace Importado";
    if (url.includes("deepseek.com")) defaultTitle = "Chat de DeepSeek";
    if (url.includes("chatgpt.com") || url.includes("openai.com")) defaultTitle = "Chat de ChatGPT";
    if (url.includes("claude.ai")) defaultTitle = "Chat de Claude";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ title: defaultTitle, content: "[Contenido protegido o enlace privado]" });
    }

    const html = await response.text();
    
    // 1. Intentamos cazar el título real de la pestaña si existe
    const matchTitle = html.match(/<title>([\s\S]*?)<\/title>/i);
    let title = matchTitle ? matchTitle[1].trim() : defaultTitle;

    // Si el título es raro o es el de carga por defecto de la web, usamos nuestro nombre estético
    if (title.length > 80 || title.includes("<") || title.toLowerCase().includes("deepseek") || title.toLowerCase().includes("chatgpt")) {
      title = defaultTitle;
    }

    // 2. LIMPIEZA QUIRÚRGICA DEL CONTENIDO (Eliminar scripts, estilos y etiquetas)
    let cleanText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "") // Borra JavaScript
      .replace(/<style[\s\S]*?<\/style>/gi, "")   // Borra Estilos CSS
      .replace(/<footer[\s\S]*?<\/footer>/gi, "") // Borra el pie de página
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")       // Borra menús de navegación
      .replace(/<[^>]+>/g, "\n")                  // Cambia cualquier etiqueta HTML por un salto de línea
      .replace(/\n\s*\n/g, "\n")                  // Elimina saltos de línea vacíos repetidos
      .trim();

    // 3. Intentamos quedarnos solo con lo importante (recortar paja de cookies/avisos al inicio)
    // Buscamos líneas que parezcan texto real de conversación
    const lines = cleanText.split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 15 && !line.includes("Next.js") && !line.includes("webpack"));

    let finalContent = lines.slice(0, 40).join("\n\n"); // Nos quedamos con los párrafos principales

    if (!finalContent || finalContent.length < 10) {
      finalContent = "[El chat requiere iniciar sesión o está protegido contra lectura automática]";
    } else {
      finalContent = finalContent.substring(0, 1200); // Límite para no reventar la tarjeta
    }

    return NextResponse.json({ 
      title, 
      content: finalContent
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}