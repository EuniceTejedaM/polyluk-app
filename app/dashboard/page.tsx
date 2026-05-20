"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BatteryCharging,
  CheckCircle2,
  CircleDot,
  MapPinned,
  ShieldAlert,
  SignalHigh,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type DogRow = Database["public"]["Tables"]["dogs"]["Row"];
type DogDeviceType = Database["public"]["Enums"]["dog_device_type"];

const deviceTypeLabels: Record<DogDeviceType, string> = {
  collar: "Collar",
  pechera: "Pechera",
  arnes_tactico: "Arnés táctico",
};

const deviceTypeOptions = [
  { value: "collar", label: "Collar", description: "Ritmo cardiaco, estrés y GPS." },
  { value: "pechera", label: "Pechera", description: "Ritmo cardiaco, estrés, GPS, temperatura y oxígeno." },
  { value: "arnes_tactico", label: "Arnés táctico", description: "Ritmo cardiaco, estrés, GPS, temperatura, oxígeno y caídas." },
] as const;

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

  if (dog.device_type) {
    return deviceTypeLabels[dog.device_type];
  }

  return "Sin tipo";
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [dogs, setDogs] = useState<DogRow[]>([]);
  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState<DogDeviceType | "">("");
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
        setLoading(false);
        return;
      }

      const dogsResult = await supabase
        .from("dogs")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (cancelled) {
        return;
      }

      setDogs(dogsResult.data ?? []);
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

    return right.created_at.localeCompare(left.created_at);
  });

  const typedDogs = orderedDogs.filter((dog) => dog.device_type).length;
  const untypedDogs = orderedDogs.length - typedDogs;
  const featuredDog = orderedDogs[0] ?? null;
  const riskDogs = orderedDogs.filter(
    (dog) => dog.battery_level < 30 || dog.temperature > 38.7 || dog.status === "sick",
  );
  const connectedBatteryLevels = orderedDogs
    .filter((dog) => dog.device_type && typeof dog.battery_level === "number")
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

    if (!selectedDeviceType) {
      setMessage("Selecciona el tipo de dispositivo antes de guardar.");
      return;
    }

    setSavingDog(true);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      
      let finalPhotoPath = null;
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${ownerId}-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from("dogs")
          .upload(fileName, photoFile);
          
        if (!uploadError && data) {
          const { data: publicUrlData } = supabase.storage.from("dogs").getPublicUrl(fileName);
          finalPhotoPath = publicUrlData.publicUrl;
        }
      }

      const dogInsert: Database["public"]["Tables"]["dogs"]["Insert"] = {
        owner_id: ownerId,
        name: dogName.trim(),
        breed: dogBreed.trim() || null,
        photo_path: finalPhotoPath,
        device_type: selectedDeviceType,
        status: "active",
      };

      const { error } = await supabase.from("dogs").insert([dogInsert] as never[]);

      if (error) {
        throw error;
      }

      const dogsResult = await supabase
        .from("dogs")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

      setDogs(dogsResult.data ?? []);
      setDogName("");
      setDogBreed("");
      setPhotoFile(null);
      setSelectedDeviceType("");
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
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">Al entrar con tu usuario verás tus perros, sus tipos de dispositivo y alertas en un panel unificado.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#233445]">Entrar</Link>
          <Link href="/register" className="rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/15">Crear cuenta</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5 lg:gap-6">
      <section className="grid gap-4">
        <div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(140deg,#fffdf9_0%,#f4ede3_100%)] p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
                Centro de operaciones
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-3xl leading-none text-foreground sm:text-4xl">
                Controla perros, tipos de dispositivo y alertas con una vista limpia.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
                Datos reales del usuario autenticado, organizados en un panel claro y sin depender de dispositivos fijos.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-[1.1rem] bg-white/85 border border-border px-4 py-2">
                <CircleDot className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Total</p>
                  <p className="text-lg font-bold text-foreground leading-none">{orderedDogs.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[1.1rem] bg-white/85 border border-border px-4 py-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Con tipo</p>
                  <p className="text-lg font-bold text-foreground leading-none">{typedDogs}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[1.1rem] bg-white/85 border border-border px-4 py-2">
                <SignalHigh className="h-5 w-5 text-brand" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Sin tipo</p>
                  <p className="text-lg font-bold text-foreground leading-none">{untypedDogs}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[1.1rem] bg-white/85 border border-border px-4 py-2">
                <ShieldAlert className="h-5 w-5 text-alert" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Alertas</p>
                  <p className="text-lg font-bold text-foreground leading-none">{riskDogs.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              Pacientes activos
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-foreground">
              Watchlist y ubicación
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex rounded-full border border-border bg-white/85 px-3 py-1 text-xs font-semibold text-muted">
              Ordenados por fecha
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-brand/90"
            >
              Asignar tipo de dispositivo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {orderedDogs.map((dog, index) => (
            <Link
              key={dog.id}
              href={`/perro/${dog.id}`}
              className="group flex flex-col justify-between rounded-[1.65rem] border border-white/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f6efe5_100%)] p-4 shadow-[0_14px_35px_rgba(11,27,40,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(11,27,40,0.14)]"
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
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${dog.device_type ? "bg-emerald-500/12 text-emerald-700" : "bg-alert/12 text-alert"}`}>
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
              
              <div className="mt-4 rounded-[1.2rem] border border-dashed border-border bg-[radial-gradient(circle_at_20%_20%,rgba(28,110,140,0.1),transparent_16%),linear-gradient(135deg,#f5efe6,#ebe2d5)] p-3">
                <div className="flex items-center justify-between gap-2 rounded-[1rem] bg-white/40 p-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <MapPinned className="h-4 w-4 text-brand" />
                    <p className="text-xs font-semibold text-foreground">Última ubicación conocida</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted">A 5m del radio</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
                  Nuevo perro
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-foreground">
                  Asignar tipo de dispositivo
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
                Foto del perro (Opcional, arrastra o selecciona)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    if (event.target.files && event.target.files.length > 0) {
                      setPhotoFile(event.target.files[0]);
                    }
                  }}
                  className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20 outline-none"
                />
              </label>

              <label className="block text-sm font-semibold text-foreground">
                Tipo de dispositivo
                <select
                  value={selectedDeviceType}
                  onChange={(event) => setSelectedDeviceType(event.target.value as DogDeviceType)}
                  className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15"
                >
                  <option value="">Selecciona una opción</option>
                  {deviceTypeOptions.map((deviceType) => (
                    <option key={deviceType.value} value={deviceType.value}>
                      {deviceType.label}
                    </option>
                  ))}
                </select>
                <span className="mt-2 block text-xs font-normal text-muted">
                  {selectedDeviceType
                    ? deviceTypeOptions.find((option) => option.value === selectedDeviceType)?.description
                    : "El tipo de dispositivo define qué métricas se simulan para este perro."}
                </span>
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