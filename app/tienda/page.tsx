"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const storeItems = [
  {
    title: "Collar doméstico",
    variant: "Classic",
    image: "/domesticreal.png",
    description: "Formato ligero para uso diario con una lectura visual limpia.",
  },
  {
    title: "Pechera de servicio",
    variant: "Professional",
    image: "/servicereal.png",
    description: "Pensada para asistencia y acompañamiento profesional.",
  },
  {
    title: "Heavy duty",
    variant: "Tactical",
    image: "/heavydutyreal.png",
    description: "Configuración robusta para trabajo operativo o rescate.",
  },
];

export default function TiendaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data?.user);
    });
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Tienda Oficial</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-foreground">Equipamiento PolyLuk.</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted">Explora nuestra colección de collares y pecheras inteligentes.</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storeItems.map((item) => (
            <article key={`${item.title}-${item.variant}`} className="overflow-hidden flex flex-col rounded-[1.65rem] border border-border bg-surface shadow-[0_16px_35px_rgba(11,27,40,0.08)] transition hover:shadow-[0_20px_45px_rgba(11,27,40,0.12)]">
              <div className="relative aspect-[4/3] w-full bg-[#f7f2eb]">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              </div>
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
                  </div>
                  <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold text-foreground">Equipamiento</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted flex-1">{item.description}</p>
                <Link href={isAuthenticated ? "/dashboard" : "/register"} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white transition hover:bg-[#0f5d76]">
                  {isAuthenticated ? "Comprar ahora" : "Crear cuenta para comprar"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
