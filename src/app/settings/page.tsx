"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fontVariables } from "@/app/fonts";
import "@/app/dashboard-tokens.css";

// ==================== CONSTANTES ====================
const APP_VERSION = "Kimberlite v1.0 Beta";
const BUILD_VERSION = "Build 001";

// ==================== ESTILOS REUTILIZABLES ====================
// Mismo lenguaje visual que el dashboard (tokens --kld-* / utilidades .kl-*).
// Los inputs conservan 44px de alto y las tarjetas su padding, así la página
// no cambia de tamaño.
const inputClass = "kl-input";

const labelClass = "kl-field-label block mb-1.5";

const cardClass = "kl-card p-6";

const sectionTitleClass = "kl-eyebrow mb-4";

// ==================== COMPONENTE PRINCIPAL ====================
export default function SettingsPage() {
  const router = useRouter();

  // Estados del usuario
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados para cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // ==================== CARGAR USUARIO ====================
  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.push("/");
          return;
        }

        const u = session.user;
        setUser(u);
        setEmail(u.email ?? "");
        setName(u.user_metadata?.name ?? u.email?.split("@")[0] ?? "");
      } catch (err: any) {
        console.error("Error loading user:", err.message);
        toast.error("Error al cargar la información del usuario.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  // ==================== GUARDAR NOMBRE ====================
  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }

    try {
      setSaving(true);
      const loadingToast = toast.loading("Guardando cambios...");

      const { error } = await supabase.auth.updateUser({
        data: { name: name.trim() },
      });

      if (error) throw error;

      toast.success("¡Cambios guardados correctamente!", { id: loadingToast });
    } catch (err: any) {
      toast.error("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==================== CAMBIAR CONTRASEÑA ====================
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Completa todos los campos de contraseña.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setChangingPassword(true);
      const loadingToast = toast.loading("Actualizando contraseña...");

      // Primero verificamos la contraseña actual intentando reautenticar
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("La contraseña actual no es correcta.", {
          id: loadingToast,
        });
        return;
      }

      // Actualizar la contraseña
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("¡Contraseña actualizada correctamente!", {
        id: loadingToast,
      });

      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error("Error al cambiar la contraseña: " + err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  // ==================== CERRAR SESIÓN ====================
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("👋 Sesión cerrada correctamente");
      router.push("/");
    } catch (err: any) {
      toast.error("Error al cerrar sesión: " + err.message);
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--kld-surface-lowest)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--kld-surface-high)] border-t-[var(--kld-primary)]" />
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className={`kl-dash min-h-screen ${fontVariables}`}>
      <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        {/* ==================== CABECERA ==================== */}
        <header className="mb-14">
          <Link
            href="/dashboard"
            className="kl-btn kl-btn--sm kl-btn--ghost -ml-3 mb-6"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            Volver al dashboard
          </Link>

          <p className="kl-eyebrow mb-2">Kimberlite</p>
          <h1 className="kl-page-title text-2xl tracking-tight">
            Configuración
          </h1>
          <p className="kl-page-sub mt-1.5">
            Gestiona tu cuenta y las preferencias básicas de Kimberlite.
          </p>
        </header>

        {/* ==================== SECCIÓN 1 — CUENTA ==================== */}
        <section className={cardClass}>
          <h2 className={sectionTitleClass}>Cuenta</h2>

          <div className="space-y-5">
            {/* Nombre */}
            <div>
              <label htmlFor="settings-name" className={labelClass}>
                Nombre
              </label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                className={inputClass}
              />
            </div>

            {/* Correo electrónico (solo lectura) */}
            <div>
              <label htmlFor="settings-email" className={labelClass}>
                Correo electrónico
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                readOnly
                autoComplete="email"
                className={`${inputClass} cursor-not-allowed opacity-60`}
                tabIndex={-1}
              />
              <p className="kl-field-hint mt-1">
                El correo electrónico no se puede modificar actualmente.
              </p>
            </div>

            {/* Botón guardar */}
            <div className="pt-1">
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="kl-btn kl-btn--primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ==================== SECCIÓN 2 — SEGURIDAD ==================== */}
        <section className={`${cardClass} mt-6`}>
          <h2 className={sectionTitleClass}>Seguridad</h2>

          <div className="space-y-5">
            {/* Contraseña actual */}
            <div>
              <label htmlFor="settings-current-password" className={labelClass}>
                Contraseña actual
              </label>
              <input
                id="settings-current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            {/* Nueva contraseña */}
            <div>
              <label htmlFor="settings-new-password" className={labelClass}>
                Nueva contraseña
              </label>
              <input
                id="settings-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass}
              />
              <p className="kl-field-hint mt-1">
                Mínimo 6 caracteres.
              </p>
            </div>

            {/* Confirmar nueva contraseña */}
            <div>
              <label htmlFor="settings-confirm-password" className={labelClass}>
                Confirmar nueva contraseña
              </label>
              <input
                id="settings-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            {/* Botón actualizar contraseña */}
            <div className="pt-1">
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="kl-btn kl-btn--primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar contraseña"
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ==================== SECCIÓN 3 — APLICACIÓN ==================== */}
        <section className={`${cardClass} mt-6`}>
          <h2 className={sectionTitleClass}>Aplicación</h2>

          <div className="space-y-4">
            {/* Versión */}
            <div className="kl-panel flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm">Versión</span>
                <p className="kl-meta mt-0.5">{BUILD_VERSION}</p>
              </div>
              <span className="kl-chip kl-chip--accent">
                {APP_VERSION}
              </span>
            </div>

            {/* Tema (próximamente) */}
            <div className="kl-panel flex items-center justify-between px-4 py-3 opacity-50">
              <span className="text-sm">Tema</span>
              <span className="kl-chip gap-1.5">
                <span className="material-symbols-outlined text-[12px]">
                  schedule
                </span>
                Próximamente
              </span>
            </div>

            {/* Idioma (próximamente) */}
            <div className="kl-panel flex items-center justify-between px-4 py-3 opacity-50">
              <span className="text-sm">Idioma</span>
              <span className="kl-chip gap-1.5">
                <span className="material-symbols-outlined text-[12px]">
                  schedule
                </span>
                Próximamente
              </span>
            </div>
          </div>
        </section>

        {/* ==================== ZONA DE PELIGRO ==================== */}
        <section className="mt-10">
          <h2 className="kl-eyebrow kl-eyebrow--muted mb-3">
            Zona de peligro
          </h2>

          <div className="kl-card kl-card--danger p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm">Eliminar cuenta</span>
                <p className="kl-meta mt-0.5">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <span className="kl-chip gap-1.5">
                <span className="material-symbols-outlined text-[12px]">
                  schedule
                </span>
                Próximamente
              </span>
            </div>
          </div>
        </section>

        {/* ==================== CERRAR SESIÓN ==================== */}
        <section className="mt-8">
          <div className="kl-divider mb-6" />
          <button
            onClick={handleLogout}
            className="kl-btn kl-btn--ghost -ml-3"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            <span>Cerrar sesión</span>
          </button>
        </section>
      </div>
    </div>
  );
}
