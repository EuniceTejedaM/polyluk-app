import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BatteryMedium,
  HeartPulse,
  Thermometer,
  Wind,
  Wifi,
  WifiOff,
} from "lucide-react";
import { dogs } from "../../mockData";

const metricCards = [
  { key: "heartRate", label: "Ritmo cardiaco", unit: "lpm", icon: HeartPulse },
  { key: "temperature", label: "Temperatura", unit: "°C", icon: Thermometer },
  { key: "respiration", label: "Respiración", unit: "rpm", icon: Wind },
  { key: "oxygen", label: "Oxigenación", unit: "%", icon: Wifi },
] as const;

export default async function DogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dog = dogs.find((item) => item.id === id);

  if (!dog) {
    notFound();
  }

  const connected = dog.status === "connected";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
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
          <Image
            src={dog.avatar}
            alt={`Foto de ${dog.name}`}
            width={110}
            height={110}
            className="h-28 w-28 rounded-[1.8rem] border-4 border-white object-cover shadow-[0_16px_35px_rgba(0,0,0,0.12)]"
          />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              Perfil biosensorial
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-foreground">
              {dog.name}
            </h1>
            <p className="mt-1 text-sm text-muted">{dog.breed}</p>

            <div className="mt-4 flex items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5">
                <BatteryMedium className="h-4 w-4 text-brand" />
                {dog.battery}% batería
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5">
                <Wifi className="h-4 w-4 text-brand" />
                {dog.deviceCode}
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
            <span className="font-semibold text-foreground">{dog.lastSeen}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Dispositivo enlazado</span>
            <span className="font-semibold text-foreground">{dog.deviceCode}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Temperatura de referencia</span>
            <span className="font-semibold text-foreground">{dog.temperature} °C</span>
          </div>
        </div>
      </section>
    </div>
  );
}