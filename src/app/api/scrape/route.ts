import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "La URL es requerida" },
        { status: 400 },
      );
    }

    // 1. Hacemos fetch a la URL externa con un User-Agent para evitar bloqueos
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`No se pudo acceder a la URL: ${response.statusText}`);
    }

    const html = await response.text();

    // 2. Extraemos el título
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const extractedTitle = titleMatch ? titleMatch[1].trim() : "Chat Externo";

    // 3. Limpiamos el contenido de etiquetas HTML, scripts y estilos
    const cleanContent = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 2000); // Limitamos a 2000 caracteres para no saturar la base de datos

    // 4. Devolvemos el resultado
    return NextResponse.json(
      {
        title: extractedTitle,
        content: cleanContent || `Contenido del enlace: ${url}`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error en /api/scrape:", error.message);
    return NextResponse.json(
      {
        title: "Enlace Guardado",
        content: `[No se pudo extraer contenido]: ${error.message}`,
      },
      { status: 200 }, // Devolvemos 200 para que el frontend no se rompa, pero con datos de fallback
    );
  }
}
