import Image from "next/image";
import { ChevronRight, LifeBuoy, LogOut, Ruler, Settings2 } from "lucide-react";
import { profile, settings } from "../mockData";

const icons = {
  notifications: Settings2,
  units: Ruler,
  support: LifeBuoy,
} as const;

export default function PerfilPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Image
            src={profile.avatar}
            alt={`Foto de perfil de ${profile.name}`}
            width={88}
            height={88}
            className="h-[5.5rem] w-[5.5rem] rounded-full border-4 border-white object-cover shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
          />

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
      </section>

      <section className="space-y-3">
        {settings.map((setting) => {
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
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-[1.35rem] border border-alert/20 bg-alert/5 px-4 py-4 text-base font-bold text-alert transition hover:bg-alert/10"
      >
        <LogOut className="h-5 w-5" />
        Cerrar Sesión
      </button>
    </div>
  );
}