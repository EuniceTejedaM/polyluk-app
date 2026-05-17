"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BatteryMedium,
  HeartPulse,
  Thermometer,
  Wind,
  Wifi,
  WifiOff,
  CalendarClock,
  ClipboardList,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type DogRow = Database["public"]["Tables"]["dogs"]["Row"];
type MedicalEventRow = Database["public"]["Tables"]["medical_events"]["Row"];

const metricCards = [
  { key: "heart_rate", label: "Ritmo cardiaco", unit: "lpm", icon: HeartPulse },
  { key: "temperature", label: "Temperatura", unit: "°C", icon: Thermometer },
  { key: "respiration_rate", label: "Respiración", unit: "rpm", icon: Wind },
  { key: "oxygen_saturation", label: "Oxigenación", unit: "%", icon: Wifi },
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

export default function DogDetailPage() {
  const params = useParams<{ id: string }>();
  const [dog, setDog] = useState<DogRow | null>(null);
  const [medicalEvents, setMedicalEvents] = useState<MedicalEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;

    const loadDog = async () => {
      const dogId = params.id;

      const [dogResult, eventsResult] = await Promise.all([
        supabase.from("dogs").select("*").eq("id", dogId).maybeSingle(),
        supabase.from("medical_events").select("*").eq("dog_id", dogId).order("event_date", { ascending: false }),
      ]);

      if (cancelled) {
        return;
      }

      setDog(dogResult.data ?? null);
      setMedicalEvents(eventsResult.data ?? []);
      setLoading(false);
    };

    loadDog();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[2rem] bg-white/70" />;
  }

  if (!dog) {
    return (
      <section className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-soft px-4 text-sm font-semibold text-foreground transition hover:bg-[#ddd4c6]"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-foreground">Perro no encontrado</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Este perfil no existe para tu sesión actual o todavía no has creado ningún perro en Supabase.</p>
      </section>
    );
  }

  const connected = Boolean(dog.device_id);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-soft text-foreground transition hover:bg-brand/12 hover:text-brand"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
              connected ? "bg-emerald-500/10 text-emerald-600" : "bg-alert/10 text-alert"
            }`}
          >
            {connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {connected ? "Conectado" : "Desconectado"}
          </span>
        </div>

        <div className="mt-5 flex items-start gap-4">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[1.8rem] bg-[linear-gradient(135deg,#1c6e8c,#8a5a34)] text-3xl font-bold text-white shadow-[0_16px_35px_rgba(0,0,0,0.12)]">
            {getInitials(dog.name)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              Perfil biosensorial
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-foreground">
              {dog.name}
            </h1>
            <p className="mt-1 text-sm text-muted">{dog.breed ?? "Sin raza registrada"}</p>

            <div className="mt-4 flex items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5">
                <BatteryMedium className="h-4 w-4 text-brand" />
                {dog.battery_level}% batería
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5">
                <Wifi className="h-4 w-4 text-brand" />
                {dog.device_id ?? "Sin dispositivo"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const value = dog[metric.key];

          return (
            <article
              key={metric.key}
              className="rounded-[1.45rem] border border-border bg-white/95 p-4 shadow-[0_12px_28px_rgba(11,27,40,0.07)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {metric.label}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">
                    {value}
                    <span className="ml-1 text-base text-muted">{metric.unit}</span>
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-soft text-brand">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-[1.7rem] border border-border bg-white/95 p-5 shadow-[0_12px_28px_rgba(11,27,40,0.07)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          Estado reciente
        </p>
        <div className="mt-3 space-y-3 text-sm text-muted">
          <div className="flex items-center justify-between gap-4">
            <span>Última actualización</span>
            <span className="font-semibold text-foreground">{dog.last_seen_at ? formatDate(dog.last_seen_at) : "Sin lecturas"}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Dispositivo enlazado</span>
            <span className="font-semibold text-foreground">{dog.device_id ?? "Sin dispositivo"}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Temperatura de referencia</span>
            <span className="font-semibold text-foreground">{dog.temperature} °C</span>
          </div>
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-border bg-white/95 p-5 shadow-[0_12px_28px_rgba(11,27,40,0.07)]">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-brand" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Historial médico</p>
        </div>
        <div className="mt-4 space-y-3">
          {medicalEvents.length > 0 ? medicalEvents.map((event) => (
            <article key={event.id} className="rounded-[1.2rem] border border-border bg-soft px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{event.title}</p>
                  <p className="mt-1 text-sm text-muted">{event.description ?? "Sin descripción"}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-foreground">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatDate(event.event_date)}
                </span>
              </div>
            </article>
          )) : (
            <div className="rounded-[1.2rem] border border-dashed border-border bg-soft px-4 py-4 text-sm text-muted">
              Aún no hay eventos médicos para este perro.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}