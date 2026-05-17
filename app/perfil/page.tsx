"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, LifeBuoy, LogOut, Ruler, Settings2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type UserProfile = {
  id: string;
  email: string;
  name: string;
};

type AccountStats = {
  dogsCount: number;
  alertsCount: number;
  devicesCount: number;
};

const icons = {
  notifications: Settings2,
  units: Ruler,
  support: LifeBuoy,
} as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PerfilPage() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<AccountStats>({ dogsCount: 0, alertsCount: 0, devicesCount: 0 });

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;

    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setProfile(null);
        return;
      }

      const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
      setProfile({
        id: user.id,
        email: user.email ?? "Sin correo",
        name: fullName || user.email?.split("@")[0] || "Usuario",
      });

      const [dogsResult, alertsResult, devicesResult] = await Promise.all([
        supabase.from("dogs").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
        supabase.from("alerts").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
        supabase.from("devices").select("id", { count: "exact", head: true }).eq("assigned_user_id", user.id),
      ]);

      if (cancelled) {
        return;
      }

      setStats({
        dogsCount: dogsResult.count ?? 0,
        alertsCount: alertsResult.count ?? 0,
        devicesCount: devicesResult.count ?? 0,
      });
    };

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <section className="rounded-[2rem] border border-white/80 bg-white/92 p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] backdrop-blur-sm">
        {profile ? (
          <div className="flex items-center gap-4">
            <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-[linear-gradient(135deg,#1c6e8c,#8a5a34)] text-2xl font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
              {getInitials(profile.name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                Perfil del usuario
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">
                {profile.name}
              </h1>
              <p className="mt-1 break-all text-sm text-muted">{profile.email}</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Sesión requerida</p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">No hay usuario activo</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Inicia sesión para ver tu perfil, tus perros y tus alertas reales.</p>
          </div>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Perros", value: stats.dogsCount },
          { label: "Alertas", value: stats.alertsCount },
          { label: "Dispositivos", value: stats.devicesCount },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-border bg-white/95 px-4 py-4 shadow-[0_12px_28px_rgba(11,27,40,0.07)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        {[
          { id: "notifications", label: "Notificaciones", value: `${stats.alertsCount} alertas registradas` },
          { id: "units", label: "Unidades de medida", value: "Métricas biométricas y ubicación" },
          { id: "support", label: "Soporte", value: "Centro de ayuda y contacto" },
        ].map((setting) => {
          const Icon = icons[setting.id as keyof typeof icons];

          return (
            <button
              key={setting.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-[1.5rem] border border-border bg-white/95 px-4 py-4 text-left shadow-[0_12px_28px_rgba(11,27,40,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(11,27,40,0.12)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft text-brand">
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-foreground">{setting.label}</p>
                <p className="mt-1 text-sm text-muted">{setting.value}</p>
              </div>

              <ChevronRight className="h-5 w-5 text-muted" />
            </button>
          );
        })}
      </section>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-[1.35rem] border border-alert/20 bg-alert/5 px-4 py-4 text-base font-bold text-alert transition hover:bg-alert/10 disabled:opacity-70"
      >
        <LogOut className="h-5 w-5" />
        {isSigningOut ? "Cerrando sesión..." : "Cerrar Sesión"}
      </button>
    </div>
  );
}