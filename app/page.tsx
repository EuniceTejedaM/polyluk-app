"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BatteryMedium, CheckCircle2, Plus, SignalHigh } from "lucide-react";
import { dogs } from "./mockData";

const statusClasses = {
  connected: "bg-emerald-500",
  disconnected: "bg-alert",
} as const;

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const connectedDogs = dogs.filter((dog) => dog.status === "connected").length;
  const disconnectedDogs = dogs.length - connectedDogs;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
              Polyluk activo
            </p>
            <h1 className="max-w-[11ch] font-[family-name:var(--font-display)] text-3xl leading-none text-foreground">
              Mis Perros
            </h1>
            <p className="max-w-xs text-sm leading-6 text-muted">
              Monitoreo biosensorial con datos simulados y navegación persistente.
            </p>
          </div>

          <div className="rounded-[1.4rem] bg-soft px-4 py-3 text-right shadow-[inset_0_0_0_1px_rgba(0,163,224,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Estado
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">
              {connectedDogs} conectados
            </p>
            <p className="text-xs text-muted">{disconnectedDogs} fuera de línea</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[1.35rem] border border-border bg-soft p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Conectados
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="font-[family-name:var(--font-display)] text-3xl text-foreground">
                {connectedDogs}
              </span>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <div className="rounded-[1.35rem] border border-border bg-soft p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Batería media
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="font-[family-name:var(--font-display)] text-3xl text-foreground">
                57%
              </span>
              <BatteryMedium className="h-6 w-6 text-brand" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {dogs.map((dog) => (
          <Link
            key={dog.id}
            href={`/perro/${dog.id}`}
            className="group rounded-[1.75rem] border border-white/80 bg-white/95 p-4 shadow-[0_14px_35px_rgba(11,27,40,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(11,27,40,0.14)]"
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <Image
                  src={dog.avatar}
                  alt={`Foto de ${dog.name}`}
                  width={76}
                  height={76}
                  className="h-[4.5rem] w-[4.5rem] rounded-full border-2 border-white object-cover shadow-[0_10px_22px_rgba(0,0,0,0.12)]"
                />
                <span
                  className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${statusClasses[dog.status as keyof typeof statusClasses]}`}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="truncate text-lg font-bold text-foreground">
                    {dog.name}
                  </h2>
                  <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    {dog.status === "connected" ? "Conectado" : "Desconectado"}
                  </span>
                </div>
                <p className="text-sm text-muted">{dog.breed}</p>
                <div className="flex items-center gap-4 pt-2 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <SignalHigh className="h-4 w-4 text-brand" />
                    {dog.lastSeen}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BatteryMedium className="h-4 w-4 text-alert" />
                    {dog.battery}%
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className="fixed bottom-24 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 justify-end px-4 pointer-events-none">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Agregar perro"
          className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_18px_30px_rgba(0,163,224,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0094cb]"
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
                  Código de Dispositivo
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-soft px-3 py-2 text-sm font-semibold text-muted transition hover:text-foreground"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-foreground">
                Ingresar código
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="PLK-0000"
                  className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
                />
              </label>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center rounded-[1rem] bg-brand text-base font-bold text-white shadow-[0_16px_30px_rgba(0,163,224,0.25)] transition hover:bg-[#0094cb]"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
