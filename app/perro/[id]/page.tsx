"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BatteryMedium,
  MapPinned,
  HeartPulse,
  Thermometer,
  Wind,
  Wifi,
  WifiOff,
  CalendarClock,
  ClipboardList,
  ShieldAlert,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

const DogGpsMap = dynamic(() => import("../../components/DogGpsMap"), { ssr: false });

type DogRow = Database["public"]["Tables"]["dogs"]["Row"];
type MedicalEventRow = Database["public"]["Tables"]["medical_events"]["Row"];
type DogDeviceType = Database["public"]["Enums"]["dog_device_type"];

type MetricKey = "heart_rate" | "stress" | "temperature" | "oxygen_saturation";

const deviceTypeLabels: Record<DogDeviceType, string> = {
  collar: "Collar",
  pechera: "Pechera",
  arnes_tactico: "Arnés táctico",
};

const deviceProfiles: Record<DogDeviceType, { label: string; metrics: MetricKey[]; hasImpactDetection: boolean }> = {
  collar: {
    label: "Collar",
    metrics: ["heart_rate", "stress"],
    hasImpactDetection: false,
  },
  pechera: {
    label: "Pechera",
    metrics: ["heart_rate", "stress", "temperature", "oxygen_saturation"],
    hasImpactDetection: false,
  },
  arnes_tactico: {
    label: "Arnés táctico",
    metrics: ["heart_rate", "stress", "temperature", "oxygen_saturation"],
    hasImpactDetection: true,
  },
};

const metricCards = {
  heart_rate: { label: "Ritmo cardiaco", unit: "lpm", icon: HeartPulse, baseValue: 72, variance: 3 },
  stress: { label: "Estrés", unit: "%", icon: Wind, baseValue: 42, variance: 4 },
  temperature: { label: "Temperatura", unit: "°C", icon: Thermometer, baseValue: 38.1, variance: 0.2 },
  oxygen_saturation: { label: "Oxigenación", unit: "%", icon: Wifi, baseValue: 98, variance: 0.5 },
} as const;

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

function getDeviceTypeLabel(deviceType: DogDeviceType | null) {
  if (!deviceType) {
    return "Sin tipo";
  }

  return deviceTypeLabels[deviceType];
}

function getDeviceProfile(deviceType: DogDeviceType | null) {
  return deviceProfiles[deviceType ?? "collar"];
}

export default function DogDetailPage() {
  const params = useParams<{ id: string }>();
  const [dog, setDog] = useState<DogRow | null>(null);
  const [medicalEvents, setMedicalEvents] = useState<MedicalEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingEvent, setSavingEvent] = useState(false);

  // Historial Form
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");

  // Graficas
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [simulatedData, setSimulatedData] = useState<Record<string, number[]>>({});
  const [impactDetected, setImpactDetected] = useState(false);

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

      const loadedDog = dogResult.data as DogRow | null;
      setDog(loadedDog);
      setMedicalEvents(eventsResult.data ?? []);

      if (loadedDog) {
        const profile = getDeviceProfile(loadedDog.device_type);

        setSimulatedData(
          Object.fromEntries(
            profile.metrics.map((metricKey) => {
              const initialValue =
                metricKey === "heart_rate"
                  ? loadedDog.heart_rate
                  : metricKey === "stress"
                    ? Math.round(loadedDog.respiration_rate * 2)
                    : metricKey === "temperature"
                      ? loadedDog.temperature
                      : loadedDog.oxygen_saturation;

              return [metricKey, Array(15).fill(initialValue)];
            }),
          ) as Record<string, number[]>,
        );

        setImpactDetected(false);
      }

      setLoading(false);
    };

    loadDog();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  useEffect(() => {
    if (!dog) return;

    const profile = getDeviceProfile(dog.device_type);
    
    const interval = setInterval(() => {
      setSimulatedData((prev) => {
        const randomize = (val: number, variance: number) => {
          const change = (Math.random() * variance * 2) - variance;
          return Number((val + change).toFixed(1));
        };

        const nextData: Record<string, number[]> = {};

        profile.metrics.forEach((metricKey) => {
          const lastValue = prev[metricKey]?.[prev[metricKey].length - 1] ?? metricCards[metricKey].baseValue;
          nextData[metricKey] = [
            ...(prev[metricKey] || []).slice(1),
            randomize(lastValue, metricCards[metricKey].variance),
          ];
        });

        return nextData;
      });

      if (profile.hasImpactDetection && Math.random() > 0.93) {
        setImpactDetected((current) => !current);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [dog]);

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEventTitle.trim() || !dog) return;

    setSavingEvent(true);
    const supabase = createSupabaseBrowserClient();
    const eventInsert = {
      owner_id: dog.owner_id,
      dog_id: dog.id,
      title: newEventTitle.trim(),
      description: newEventDesc.trim() || null,
      event_date: new Date().toISOString(),
    };

    const { error } = await supabase.from("medical_events").insert([eventInsert] as any);
    if (!error) {
      setNewEventTitle("");
      setNewEventDesc("");
      const { data } = await supabase.from("medical_events").select("*").eq("dog_id", dog.id).order("event_date", { ascending: false });
      setMedicalEvents(data ?? []);
    }
    setSavingEvent(false);
  }

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

  const activeDeviceType = dog.device_type ?? "collar";
  const profile = getDeviceProfile(dog.device_type);
  const connected = Boolean(dog.device_type || dog.device_id);
  const visibleMetrics = profile.metrics;

  const renderGraph = (metricKey: string) => {
    const data = simulatedData[metricKey];
    if (!data || data.length === 0) return null;

    const min = Math.min(...data) - 2;
    const max = Math.max(...data) + 2;
    const range = max - min || 1;
    const width = 200;
    const height = 40;

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="mt-4 border-t border-border pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-full overflow-visible" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand opacity-80"
          />
          {/* Pulsing end point */}
          <circle 
            cx={width} 
            cy={height - ((data[data.length - 1] - min) / range) * height} 
            r="3" 
            className="fill-brand animate-pulse" 
          />
        </svg>
      </div>
    );
  };

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
            {getDeviceTypeLabel(dog.device_type)}
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

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5">
                <BatteryMedium className="h-4 w-4 text-brand" />
                {dog.battery_level}% batería
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5">
                <MapPinned className="h-4 w-4 text-brand" />
                GPS activo
              </span>
            </div>
          </div>
        </div>
      </section>

      <DogGpsMap title={`Ubicación GPS de ${dog.name}`} />

      <section className="grid grid-cols-2 gap-3">
        {visibleMetrics.map((metricKey) => {
          const metric = metricCards[metricKey];
          const Icon = metric.icon;
          const dataHistory = simulatedData[metricKey];
          const currentValue = dataHistory && dataHistory.length > 0
            ? dataHistory[dataHistory.length - 1]
            : metric.baseValue;
          const isExpanded = expandedMetric === metricKey;
          const formattedValue = metricKey === "temperature" ? currentValue.toFixed(1) : Math.round(currentValue);

          return (
            <article
              key={metricKey}
              onClick={() => setExpandedMetric(isExpanded ? null : metricKey)}
              className={`rounded-[1.45rem] border border-border bg-white/95 p-4 shadow-[0_12px_28px_rgba(11,27,40,0.07)] cursor-pointer hover:border-brand/40 transition-colors ${isExpanded ? 'col-span-2' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {metric.label}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">
                    {formattedValue}
                    <span className="ml-1 text-base text-muted">{metric.unit}</span>
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-soft text-brand">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              {isExpanded && renderGraph(metricKey)}
            </article>
          );
        })}

        {profile.hasImpactDetection ? (
          <article className={`rounded-[1.45rem] border border-border bg-white/95 p-4 shadow-[0_12px_28px_rgba(11,27,40,0.07)] ${visibleMetrics.length % 2 === 0 ? '' : 'col-span-2'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Golpes o caídas
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">
                  {impactDetected ? "Alerta" : "Sin eventos"}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-soft text-brand">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
          </article>
        ) : null}
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
            <span>Tipo de dispositivo</span>
            <span className="font-semibold text-foreground">{getDeviceTypeLabel(dog.device_type)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>GPS</span>
            <span className="font-semibold text-foreground">Ubicación del usuario en el mapa</span>
          </div>
          {activeDeviceType !== "collar" ? (
            <div className="flex items-center justify-between gap-4">
              <span>Temperatura de referencia</span>
              <span className="font-semibold text-foreground">{dog.temperature} °C</span>
            </div>
          ) : null}
          {profile.hasImpactDetection ? (
            <div className="flex items-center justify-between gap-4">
              <span>Detector de caídas</span>
              <span className="font-semibold text-foreground">{impactDetected ? "Alerta" : "En monitoreo"}</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-border bg-white/95 p-5 shadow-[0_12px_28px_rgba(11,27,40,0.07)]">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-brand" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Historial médico</p>
        </div>

        <form onSubmit={handleAddEvent} className="mt-4 space-y-3">
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Ej. Vacuna Rabia" 
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full rounded-[1rem] border border-border bg-soft px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/15"
              required 
            />
            <input 
              type="text" 
              placeholder="Descripción breve (opcional)" 
              value={newEventDesc}
              onChange={(e) => setNewEventDesc(e.target.value)}
              className="w-full rounded-[1rem] border border-border bg-soft px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
            <button 
              type="submit" 
              disabled={savingEvent || !newEventTitle.trim()}
              className="w-full rounded-[1rem] bg-brand text-white py-3 text-sm font-bold shadow-md transition hover:bg-brand/90 disabled:opacity-50"
            >
              {savingEvent ? "Añadiendo..." : "Añadir al historial"}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-3">
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