import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Falta la URL" }, { status: 400 });
    }

    // El servidor hace la petición a la URL externa burlando el CORS del navegador
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "No se pudo acceder a la URL" }, { status: 400 });
    }

    const html = await response.text();
    
    // De momento extraemos el título y limpiamos etiquetas HTML básicas
    const matchTitle = html.match(/<title>([\s\S]*?)<\/title>/i);
    const title = matchTitle ? matchTitle[1].trim() : "Chat Importado";

    // Un limpiador ultra-básico de texto para no guardar código HTML puro
    const cleanText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 2000); // Guardamos los primeros 2000 caracteres de prueba

    return NextResponse.json({ 
      title, 
      content: `[Contenido extraído automáticamente]:\n\n${cleanText}` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}