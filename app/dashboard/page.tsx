"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  CircleDot,
  MapPinned,
  Plus,
  ShieldAlert,
  SignalHigh,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type DogRow = Database["public"]["Tables"]["dogs"]["Row"];
type DeviceRow = Database["public"]["Tables"]["devices"]["Row"];

const avatarGradients = [
  "from-[#1c6e8c] to-[#3d8aa5]",
  "from-[#233445] to-[#1c6e8c]",
  "from-[#8a5a34] to-[#c28c5d]",
  "from-[#0f1720] to-[#374454]",
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getDogStatusLabel(dog: DogRow) {
  if (dog.status === "missing") {
    return "Desaparecido";
  }

  if (dog.status === "sick") {
    return "Atención";
  }

  if (dog.device_id) {
    return "Conectado";
  }

  return "Sin dispositivo";
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [dogs, setDogs] = useState<DogRow[]>([]);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [savingDog, setSavingDog] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;

    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      setOwnerId(user?.id ?? null);

      if (!user) {
        setDogs([]);
        setDevices([]);
        setLoading(false);
        return;
      }

      const [dogsResult, devicesResult] = await Promise.all([
        supabase
          .from("dogs")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("devices").select("*").order("created_at", { ascending: false }),
      ]);

      if (cancelled) {
        return;
      }

      setDogs(dogsResult.data ?? []);
      setDevices(devicesResult.data ?? []);
      setLoading(false);
    };

    loadDashboard();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setOwnerId(session?.user.id ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const orderedDogs = [...dogs].sort((left, right) => {
    if (left.status === right.status) {
      return right.created_at.localeCompare(left.created_at);
    }

    return left.device_id ? -1 : 1;
  });

  const connectedDogs = orderedDogs.filter((dog) => dog.device_id).length;
  const disconnectedDogs = orderedDogs.length - connectedDogs;
  const featuredDog = orderedDogs[0] ?? null;
  const riskDogs = orderedDogs.filter(
    (dog) => dog.battery_level < 30 || dog.temperature > 38.7 || dog.status === "sick",
  );
  const connectedBatteryLevels = orderedDogs
    .filter((dog) => dog.device_id && typeof dog.battery_level === "number")
    .map((dog) => dog.battery_level);
  const averageBatteryLevel =
    connectedBatteryLevels.length > 0
      ? Math.round(
          connectedBatteryLevels.reduce((sum, level) => sum + level, 0) /
            connectedBatteryLevels.length,
        )
      : null;

  async function handleCreateDog() {
    if (!ownerId || !dogName.trim()) {
      setMessage("Agrega al menos el nombre del perro.");
      return;
    }

    setSavingDog(true);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("dogs").insert({
        owner_id: ownerId,
        name: dogName.trim(),
        breed: dogBreed.trim() || null,
        device_id: selectedDeviceId || null,
        status: selectedDeviceId ? "active" : "inactive",
      });

      if (error) {
        throw error;
      }

      const [dogsResult, devicesResult] = await Promise.all([
        supabase
          .from("dogs")
          .select("*")
          .eq("owner_id", ownerId)
          .order("created_at", { ascending: false }),
        supabase.from("devices").select("*").order("created_at", { ascending: false }),
      ]);

      setDogs(dogsResult.data ?? []);
      setDevices(devicesResult.data ?? []);
      setDogName("");
      setDogBreed("");
      setSelectedDeviceId("");
      setIsModalOpen(false);
    } catch (createError) {
      setMessage(createError instanceof Error ? createError.message : "No se pudo crear el perro.");
    } finally {
      setSavingDog(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
          <div className="h-7 w-56 animate-pulse rounded-full bg-soft" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="h-24 animate-pulse rounded-[1.35rem] bg-soft" />
            <div className="h-24 animate-pulse rounded-[1.35rem] bg-soft" />
            <div className="h-24 animate-pulse rounded-[1.35rem] bg-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (!ownerId) {
    return (
      <section className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Acceso requerido</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">Inicia sesión para ver tus perros</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">El panel ahora se alimenta únicamente de Supabase. Al entrar con tu usuario verás sólo tus perros, dispositivos y alertas.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#233445]">Entrar</Link>
          <Link href="/register" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-soft">Crear cuenta</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5 lg:gap-6">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(140deg,#fffdf9_0%,#f4ede3_100%)] p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
                Centro de operaciones
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-3xl leading-none text-foreground sm:text-4xl">
                Controla perros, dispositivos y alertas con una vista limpia.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
                Esta pantalla ya se alimenta de Supabase: sólo perros reales del usuario autenticado, sin datos de demo ni nombres inventados.
              </p>
            </div>

            <div className="grid min-w-[220px] gap-3 rounded-[1.5rem] border border-border bg-white/85 p-4">
              <div className="flex items-center justify-between gap-4 rounded-[1.1rem] bg-soft px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Conectados</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{connectedDogs}</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-[1.1rem] bg-soft px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Fuera de línea</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{disconnectedDogs}</p>
                </div>
                <SignalHigh className="h-6 w-6 text-brand" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-border bg-white/85 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Batería media</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-3xl font-bold text-foreground">{averageBatteryLevel ?? "—"}</span>
                <BatteryCharging className="h-6 w-6 text-brand" />
              </div>
              <p className="mt-2 text-xs text-muted">
                {averageBatteryLevel !== null
                  ? "Promedio de perros con dispositivo vinculado"
                  : "Sin pechera o collar conectado"}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-border bg-white/85 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Pacientes activos</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-3xl font-bold text-foreground">{orderedDogs.length}</span>
                <CircleDot className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-border bg-white/85 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Riesgo</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-3xl font-bold text-foreground">{riskDogs.length}</span>
                <ShieldAlert className="h-6 w-6 text-alert" />
              </div>
            </div>
          </div>
        </div>

        <article className="overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(160deg,#13202b_0%,#233445_100%)] p-5 text-white shadow-[0_20px_50px_rgba(11,27,40,0.12)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Paciente destacado</p>
              <h2 className="mt-2 text-2xl font-semibold">{featuredDog ? featuredDog.name : "Sin pacientes"}</h2>
              <p className="mt-1 text-sm text-white/75">{featuredDog ? featuredDog.breed ?? "Sin raza registrada" : "Añade un perro para verlo aquí"}</p>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-semibold ${featuredDog?.device_id ? "bg-emerald-500/20 text-emerald-200" : "bg-alert/20 text-alert"}`}>
              {featuredDog?.device_id ? "Conectado" : "Sin dispositivo"}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">Última señal</p>
              <p className="mt-2 text-lg font-semibold">{featuredDog?.last_seen_at ? new Date(featuredDog.last_seen_at).toLocaleString() : "Sin lecturas"}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">Dispositivo</p>
              <p className="mt-2 text-lg font-semibold">{featuredDog?.device_id ?? "Sin dispositivo vinculado"}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/8 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">Atajos</p>
                <p className="mt-1 text-lg font-semibold">Acciones frecuentes</p>
              </div>
              <ArrowRight className="h-5 w-5 text-white/70" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link href={featuredDog ? `/perro/${featuredDog.id}` : "/register"} className="rounded-[1.1rem] bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-[#f5efe6]">
                Abrir ficha
              </Link>
              <button type="button" onClick={() => setIsModalOpen(true)} className="rounded-[1.1rem] border border-white/15 bg-[#f3ece2] px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-[#e7dece]">
                Vincular dispositivo
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                Pacientes activos
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-foreground">
                Watchlist clínica
              </h2>
            </div>
            <span className="rounded-full border border-border bg-white/85 px-3 py-1 text-xs font-semibold text-muted">
              Ordenados por conexión
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {orderedDogs.map((dog, index) => (
              <Link
                key={dog.id}
                href={`/perro/${dog.id}`}
                className="group rounded-[1.65rem] border border-white/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f6efe5_100%)] p-4 shadow-[0_14px_35px_rgba(11,27,40,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(11,27,40,0.14)]"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[1.4rem] bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} text-lg font-bold text-white shadow-[0_10px_22px_rgba(0,0,0,0.12)]`}>
                    {getInitials(dog.name)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="truncate text-lg font-bold text-foreground">
                        {dog.name}
                      </h2>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${dog.device_id ? "bg-emerald-500/12 text-emerald-700" : "bg-alert/12 text-alert"}`}>
                        {getDogStatusLabel(dog)}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{dog.breed ?? "Sin raza registrada"}</p>
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-muted">
                      <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1">
                        <SignalHigh className="h-4 w-4 text-brand" />
                        {dog.last_seen_at ? new Date(dog.last_seen_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Sin lectura"}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1">
                        <BatteryCharging className="h-4 w-4 text-alert" />
                        {dog.battery_level}%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.7rem] border border-white/80 bg-white/92 p-5 shadow-[0_14px_35px_rgba(11,27,40,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              Mapa y estado
            </p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">Última ubicación conocida</h3>
            <div className="mt-4 aspect-[4/3] rounded-[1.4rem] border border-dashed border-border bg-[radial-gradient(circle_at_20%_20%,rgba(28,110,140,0.22),transparent_16%),radial-gradient(circle_at_80%_30%,rgba(138,90,52,0.18),transparent_18%),linear-gradient(135deg,#f5efe6,#ebe2d5)] p-4">
              <div className="flex h-full flex-col justify-between rounded-[1.2rem] border border-white/60 bg-white/35 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Dispositivo</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">{devices.find((device) => device.id === featuredDog?.device_id)?.code ?? "Sin dispositivo"}</p>
                  </div>
                  <MapPinned className="h-5 w-5 text-brand" />
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Rango de prueba</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">Hasta 5 m alrededor del dispositivo seleccionado</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                    Actualización activa
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-white/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f6efe5_100%)] p-5 shadow-[0_14px_35px_rgba(11,27,40,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              Riesgos recientes
            </p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">Atención prioritaria</h3>
            <div className="mt-4 space-y-3">
              {riskDogs.length > 0 ? riskDogs.map((dog) => (
                <div key={dog.id} className="rounded-[1.2rem] border border-border bg-white/85 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{dog.name}</p>
                      <p className="text-sm text-muted">Batería {dog.battery_level}% · Temperatura {dog.temperature} °C</p>
                    </div>
                    <span className="rounded-full bg-alert/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alert">
                      Prioridad
                    </span>
                  </div>
                </div>
              )) : (
                <div className="rounded-[1.2rem] border border-border bg-white/85 px-4 py-3 text-sm text-muted">
                  No hay pacientes en riesgo visible ahora mismo.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-24 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 justify-end px-4 pointer-events-none">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Agregar perro"
          className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-white shadow-[0_18px_30px_rgba(11,27,40,0.32)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#233445]"
        >
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </button>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 px-4 pb-28 pt-8 backdrop-blur-[2px] sm:items-center sm:pb-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-[420px] rounded-[1.75rem] border border-white/80 bg-white p-5 shadow-[0_30px_80px_rgba(11,27,40,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                  Conectar perro
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-foreground">
                  Nuevo perro
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-soft px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-[#ddd4c6]"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-foreground">
                Nombre del perro
                <input
                  ref={inputRef}
                  type="text"
                  value={dogName}
                  onChange={(event) => setDogName(event.target.value)}
                  placeholder="Ej. Kuma"
                  className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
                />
              </label>

              <label className="block text-sm font-semibold text-foreground">
                Raza
                <input
                  type="text"
                  value={dogBreed}
                  onChange={(event) => setDogBreed(event.target.value)}
                  placeholder="Ej. Labrador"
                  className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
                />
              </label>

              <label className="block text-sm font-semibold text-foreground">
                Vincular dispositivo
                <select
                  value={selectedDeviceId}
                  onChange={(event) => setSelectedDeviceId(event.target.value)}
                  className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
                >
                  <option value="">Sin dispositivo</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.code} {device.label ? `· ${device.label}` : ""}
                    </option>
                  ))}
                </select>
              </label>

              {message ? (
                <p className="rounded-[1rem] border border-alert/20 bg-alert/6 px-4 py-3 text-sm text-alert">
                  {message}
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleCreateDog}
                disabled={savingDog}
                className="inline-flex h-12 w-full items-center justify-center rounded-[1rem] bg-foreground text-base font-bold text-white shadow-[0_16px_30px_rgba(11,27,40,0.2)] transition hover:bg-[#233445]"
              >
                {savingDog ? "Guardando..." : "Guardar perro"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}