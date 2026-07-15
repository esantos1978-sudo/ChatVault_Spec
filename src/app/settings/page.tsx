"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// ==================== CONSTANTES ====================
const APP_VERSION = "Kimberlite v1.0 Beta";
const BUILD_VERSION = "Build 001";

// ==================== ESTILOS REUTILIZABLES ====================
const inputClass =
  "w-full h-[44px] rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 hover:border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-180";

const labelClass = "block text-xs font-medium text-zinc-500 mb-1.5";

const cardClass =
  "rounded-2xl border border-zinc-800/60 bg-zinc-900 p-6 shadow-premium";

const sectionTitleClass =
  "text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4";

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
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-500" />
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        {/* ==================== CABECERA ==================== */}
        <header className="mb-14">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Configuración
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Gestiona tu cuenta y las preferencias básicas de Kimberlite.
          </p>
        </header>

        {/* ==================== SECCIÓN 1 — CUENTA ==================== */}
        <section className={cardClass}>
          <h2 className={sectionTitleClass}>Cuenta</h2>

          <div className="space-y-5">
            {/* Nombre */}
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className={inputClass}
              />
            </div>

            {/* Correo electrónico (solo lectura) */}
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input
                type="email"
                value={email}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-60`}
                tabIndex={-1}
              />
              <p className="mt-1 text-[11px] text-zinc-600">
                El correo electrónico no se puede modificar actualmente.
              </p>
            </div>

            {/* Botón guardar */}
            <div className="pt-1">
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="inline-flex items-center gap-2 gemstone-gradient text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-180 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              <label className={labelClass}>Contraseña actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className={labelClass}>Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {/* Confirmar nueva contraseña */}
            <div>
              <label className={labelClass}>Confirmar nueva contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {/* Botón actualizar contraseña */}
            <div className="pt-1">
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="inline-flex items-center gap-2 gemstone-gradient text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:brightness-95 transition-all duration-180 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-zinc-950/50 px-4 py-3">
              <div>
                <span className="text-sm text-zinc-400">Versión</span>
                <p className="mt-0.5 text-[11px] text-zinc-600">
                  {BUILD_VERSION}
                </p>
              </div>
              <span className="text-sm font-medium text-zinc-100">
                {APP_VERSION}
              </span>
            </div>

            {/* Tema (próximamente) */}
            <div className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-zinc-950/50 px-4 py-3 opacity-50">
              <span className="text-sm text-zinc-400">Tema</span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                <span className="material-symbols-outlined text-[12px]">
                  schedule
                </span>
                Próximamente
              </span>
            </div>

            {/* Idioma (próximamente) */}
            <div className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-zinc-950/50 px-4 py-3 opacity-50">
              <span className="text-sm text-zinc-400">Idioma</span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
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
          <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">
            Zona de peligro
          </h2>

          <div className="rounded-2xl border border-zinc-800/30 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-zinc-400">Eliminar cuenta</span>
                <p className="mt-0.5 text-[11px] text-zinc-600">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                <span className="material-symbols-outlined text-[12px]">
                  schedule
                </span>
                Próximamente
              </span>
            </div>
          </div>
        </section>

        {/* ==================== CERRAR SESIÓN ==================== */}
        <section className="mt-6">
          <button
            onClick={handleLogout}
            className="sidebar-item w-full justify-start"
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
