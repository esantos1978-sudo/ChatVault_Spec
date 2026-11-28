import HomeView, { type AuthMode } from "@/components/HomeView";

/* La URL es la única fuente de verdad del modo de autenticación:
     /                  → landing
     /?auth=login       → formulario de inicio de sesión
     /?auth=register    → formulario de registro

   El modo se resuelve aquí, en el servidor, y se pasa como prop. Así la
   primera pintura ya es la vista correcta: sin `useSearchParams`, sin
   `<Suspense>` y sin el spinner que aparecía y desaparecía al entrar. */
function parseAuthMode(value: string | string[] | undefined): AuthMode | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "login" || raw === "register" ? raw : null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const authMode = parseAuthMode((await searchParams).auth);

  return <HomeView authMode={authMode} />;
}
