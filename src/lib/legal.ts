/* ==========================================================================
   Kimberlite — datos compartidos de las páginas legales
   --------------------------------------------------------------------------
   /privacidad y /terminos leen de aquí la fecha y el email de contacto:
   un único sitio que editar cuando cambie el buzón definitivo (Google Cloud
   Console pide esta URL pública para publicar la app OAuth).
   No hay lógica de cliente: sólo constantes.
   ========================================================================== */

/** Fecha mostrada en el eyebrow, en formato legible. */
export const LEGAL_LAST_UPDATED = "25 de noviembre de 2026";

/** Misma fecha en ISO-8601 para el atributo `dateTime` de <time>. */
export const LEGAL_LAST_UPDATED_ISO = "2026-11-25";

/** Buzón público de contacto. Sustituir por el email real antes del lanzamiento. */
export const LEGAL_CONTACT_EMAIL = "contacto@kimberlite.online";
