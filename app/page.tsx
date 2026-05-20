import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  ShieldCheck,
  Activity,
  Layers3,
  MapPinned,
  Sparkles,
  Stethoscope,
  TimerReset,
  Upload,
  ShieldAlert,
} from "lucide-react";

const pipelineStages = [
  {
    title: "1. Captura",
    description: "Sensores activos registran HRV, SpO2, temperatura y señales de fatiga en tiempo real de forma precisa.",
    icon: Activity,
  },
  {
    title: "2. Análisis",
    description: "Nuestra infraestructura procesa las lecturas con Machine Learning para detectar anomalías al instante.",
    icon: Brain,
  },
  {
    title: "3. Alerta",
    description: "La app te notifica de inmediato cuando se detecta un riesgo clínico o un comportamiento anómalo.",
    icon: ShieldAlert,
  },
];

const productLines = [
  {
    title: "Doméstica",
    value: "Collar",
    detail: "Monitoreo cardíaco, estrés y GPS para seguimiento cotidiano.",
    icon: Upload,
  },
  {
    title: "Service",
    value: "Pechera inteligente",
    detail: "Suma temperatura y oxígeno en sangre para vigilancia clínica.",
    icon: Stethoscope,
  },
  {
    title: "Heavy Duty",
    value: "Arnés táctico",
    detail: "Añade detección de golpes o caídas para uso intensivo.",
    icon: ShieldCheck,
  },
];

const impact = [
  {
    title: "Protección integral",
    value: "Salud asegurada",
    detail: "Extiende la vida operativa y bienestar minimizando retiros prematuros.",
    icon: TimerReset,
  },
  {
    title: "Prevención de emergencias",
    value: "Alertas tempranas",
    detail: "Detecta fatiga, calor extremo y descompensación antes de que ocurran.",
    icon: Layers3,
  },
  {
    title: "Monitoreo Inteligente",
    value: "Conexión en línea",
    detail: "Manten la operatividad y confianza con un sistema de GPS y red constante.",
    icon: MapPinned,
  },
];

const steps = [
  {
    title: "Crea tu cuenta de acceso",
    text: "Registro rápido y directo para iniciar sin fricción.",
  },
  {
    title: "Registra a tu perro",
    text: "Registra su información y asigna el tipo de dispositivo correspondiente.",
  },
  {
    title: "Supervisa y actúa",
    text: "Consulta métricas, ubicación, alertas y evolución desde un solo panel.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.6rem] border border-white/10 bg-[#0f1720] text-white p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_20%),radial-gradient(circle_at_15%_80%,_rgba(28,110,140,0.3),_transparent_35%)]" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma Clínica y Monitoreo Inteligente
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl leading-tight">
              Cuidamos a quienes más nos cuidan.
            </h1>
            <p className="text-lg text-white/80 max-w-xl">
              PolyLuk convierte collares y pecheras inteligentes en un ecosistema de protección y salud para perros de servicio, rescate y hogar.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-white transition hover:bg-[#0f5d76]"
              >
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-transparent px-6 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Entrar a mi panel
              </Link>
              <Link
                href="/tienda"
                className="inline-flex h-12 items-center justify-center rounded-full border border-brand/40 bg-brand/10 px-6 text-sm font-bold text-white transition hover:bg-brand/20"
              >
                Visitar la tienda
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex w-full max-w-sm flex-col gap-4">
            <div className="rounded-[1.5rem] bg-white/5 border border-white/10 p-5 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Flujo Directo</p>
              <h3 className="mt-2 text-xl font-bold">Unifica el cuidado canino</h3>
              <p className="mt-2 text-sm text-white/80">Todo desde un panel de operaciones sin complicaciones y con visión en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {pipelineStages.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2.4rem] border border-border bg-surface p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Características Clave</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-foreground">
            Tres líneas de producto para cualquier situación.
          </h2>
          <div className="mt-8 grid gap-4">
            {productLines.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 items-start rounded-2xl bg-soft p-4 border border-border/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title} · <span className="font-medium text-muted">{item.value}</span></h3>
                    <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2.4rem] border border-white/10 bg-[#141d26] p-8 shadow-sm text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Impacto Operativo</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-white">
              Cuidamos cada aspecto.
            </h2>
            <div className="mt-8 grid gap-4">
              {impact.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 items-start border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-white/70">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2.4rem] border border-border bg-soft p-8 text-center sm:p-12 shadow-inner">
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-foreground">
          Lo que necesitas para probar sin fricción.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto text-left">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[2rem] bg-white p-6 shadow-sm border border-border/50">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-white mb-4">
                {index + 1}
              </span>
              <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/register"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand px-8 text-base font-bold text-white transition hover:bg-[#0f5d76] shadow-lg"
          >
             Empezar ahora gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
