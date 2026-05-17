"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDownAZ, CircleAlert, Clock3, Dog, HeartPulse, MapPinned, BatteryCharging } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type AlertRow = Database["public"]["Tables"]["alerts"]["Row"];
type DogRow = Database["public"]["Tables"]["dogs"]["Row"];

const alertTypeConfig = {
  health: { label: "Alerta de salud", icon: HeartPulse, badge: "bg-alert/10 text-alert", accent: "border-alert" },
  location: { label: "Alerta de ubicación", icon: MapPinned, badge: "bg-brand/10 text-brand", accent: "border-brand" },
  battery: { label: "Alerta de batería baja", icon: BatteryCharging, badge: "bg-[#8a5a34]/10 text-[#8a5a34]", accent: "border-[#8a5a34]" },
  connectivity: { label: "Conectividad", icon: CircleAlert, badge: "bg-amber-500/10 text-amber-700", accent: "border-amber-500" },
  device: { label: "Dispositivo", icon: Dog, badge: "bg-slate-900/10 text-slate-900", accent: "border-slate-900" },
} as const;

function getSeverityLabel(severity: AlertRow["severity"]) {
  if (severity === "critical") return "Crítica";
  if (severity === "warning") return "Advertencia";
  return "Informativa";
}

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [dogs, setDogs] = useState<DogRow[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;

    const loadAlerts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user) {
        setAlerts([]);
        setDogs([]);
        setLoading(false);
        return;
      }

      const [alertsResult, dogsResult] = await Promise.all([
        supabase
          .from("alerts")
          .select("*")
          .eq("owner_id", user.id)
          .order("occurred_at", { ascending: false }),
        supabase.from("dogs").select("id, name").eq("owner_id", user.id).order("name", { ascending: true }),
      ]);

      if (cancelled) {
        return;
      }

      setAlerts(alertsResult.data ?? []);
      setDogs(dogsResult.data ?? []);
      setLoading(false);
    };

    loadAlerts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAlerts = useMemo(() => {
    const items = alerts
      .filter((alert) => (selectedDogId === "all" ? true : alert.dog_id === selectedDogId))
      .filter((alert) => (selectedType === "all" ? true : alert.type === selectedType))
      .sort((left, right) => {
        const leftTime = new Date(left.occurred_at).getTime();
        const rightTime = new Date(right.occurred_at).getTime();

        return sortDirection === "desc" ? rightTime - leftTime : leftTime - rightTime;
      });

    return items;
  }, [alerts, selectedDogId, selectedType, sortDirection]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(alerts.map((alert) => alert.type)));
  }, [alerts]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-[2rem] bg-white/70" />
        <div className="h-20 animate-pulse rounded-[1.5rem] bg-white/70" />
        <div className="h-20 animate-pulse rounded-[1.5rem] bg-white/70" />
      </div>
    );
  }

  if (!alerts.length) {
    return (
      <section className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Centro de eventos</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">Alertas</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">No hay alertas registradas para tu cuenta todavía. Cuando conectes dispositivos y perros reales, aparecerán aquí con filtros por perro, tipo y fecha.</p>
      </section>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <section className="rounded-[2rem] border border-white/80 bg-white/92 p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Centro de eventos</p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">Alertas</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Alertas reales del usuario autenticado, organizadas por tipo, perro y fecha. Sin contenido de prueba incrustado.</p>
          </div>
          <div className="hidden rounded-[1.2rem] bg-soft px-4 py-3 text-right sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Totales</p>
            <p className="mt-1 text-sm font-bold text-foreground">{filteredAlerts.length} visibles</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 rounded-[1.75rem] border border-white/80 bg-white/92 p-4 shadow-[0_12px_28px_rgba(11,27,40,0.07)] sm:grid-cols-3">
        <label className="block text-sm font-semibold text-foreground">
          Perro
          <select value={selectedDogId} onChange={(event) => setSelectedDogId(event.target.value)} className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none focus:border-brand focus:ring-4 focus:ring-brand/15">
            <option value="all">Todos</option>
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>{dog.name}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-foreground">
          Tipo de alerta
          <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none focus:border-brand focus:ring-4 focus:ring-brand/15">
            <option value="all">Todas</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{alertTypeConfig[type as keyof typeof alertTypeConfig]?.label ?? type}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-foreground">
          Orden
          <button
            type="button"
            onClick={() => setSortDirection((current) => (current === "desc" ? "asc" : "desc"))}
            className="mt-2 inline-flex h-12 w-full items-center justify-between rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground transition hover:bg-[#ddd4c6]"
          >
            <span>{sortDirection === "desc" ? "Más recientes" : "Más antiguas"}</span>
            <ArrowDownAZ className="h-4 w-4" />
          </button>
        </label>
      </section>

      <section className="space-y-3">
        {filteredAlerts.map((alert) => {
          const typeConfig = alertTypeConfig[alert.type as keyof typeof alertTypeConfig];
          const Icon = typeConfig?.icon ?? AlertTriangle;

          return (
            <article
              key={alert.id}
              className={`rounded-[1.5rem] border-l-4 ${typeConfig?.accent ?? "border-border"} bg-white/95 p-4 shadow-[0_12px_28px_rgba(11,27,40,0.07)]`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft ${typeConfig?.badge ?? "text-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${typeConfig?.badge ?? "bg-soft text-foreground"}`}
                    >
                      {typeConfig?.label ?? alert.type}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                      <Clock3 className="h-3.5 w-3.5" />
                      {new Date(alert.occurred_at).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-base font-bold leading-6 text-foreground">
                    {alert.title}
                  </h2>
                  <p className="text-sm leading-6 text-muted">{alert.detail}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted">
                    <span>Severidad: {getSeverityLabel(alert.severity)}</span>
                    <span>•</span>
                    <span>Perro: {dogs.find((dog) => dog.id === alert.dog_id)?.name ?? "Desconocido"}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}