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
    title: "Captura",
    description: "Sensores activos registran HRV, SpO2, temperatura y señales de fatiga en tiempo real.",
    icon: Activity,
  },
  {
    title: "Análisis",
    description: "La nube procesa las lecturas con Machine Learning para detectar anomalías y patrones.",
    icon: Brain,
  },
  {
    title: "Alerta",
    description: "La app notifica de inmediato cuando hay riesgo, desconexión o comportamiento anómalo.",
    icon: ShieldAlert,
  },
];

const highlights = [
  {
    title: "Alta de usuarios y perros",
    description: "Cada usuario crea su cuenta y empieza a registrar pacientes sin pasos confusos.",
    icon: BadgeCheck,
  },
  {
    title: "Fotos y expediente clínico",
    description: "Guarda imágenes, eventos médicos y evolución biométrica en una sola ficha.",
    icon: Upload,
  },
  {
    title: "Ubicación y alertas útiles",
    description: "Mapa, batería, salud y avisos con prioridad visual clara para actuar rápido.",
    icon: MapPinned,
  },
];

const productLines = [
  {
    title: "Doméstica",
    value: "Collar GPS 24/7",
    detail: "Monitoreo cardíaco, estrés, temperatura y oxigenación para seguimiento cotidiano.",
    icon: Upload,
  },
  {
    title: "Service",
    value: "Pechera inteligente",
    detail: "Mayor flexibilidad operativa, historial médico y compartición de datos con veterinarios.",
    icon: Stethoscope,
  },
  {
    title: "Heavy Duty",
    value: "Rescate e institución",
    detail: "Giroscopio integral, detector de fatiga y adaptación a equipamiento de trabajo.",
    icon: ShieldCheck,
  },
];

const impact = [
  {
    title: "Protección de la inversión",
    value: "Menos retiros prematuros",
    detail: "Un ejemplar puede representar una inversión de cientos de miles de pesos.",
    icon: TimerReset,
  },
  {
    title: "Prevención de emergencias",
    value: "Alertas antes del colapso",
    detail: "Detecta fatiga, calor extremo y descompensación antes de que escalen.",
    icon: Layers3,
  },
  {
    title: "Autonomía del usuario",
    value: "Seguimiento continuo",
    detail: "Ayuda a mantener operatividad y confianza para rescate, servicio y hogar.",
    icon: Stethoscope,
  },
];

const steps = [
  {
    title: "Crea tu cuenta",
    text: "Registro limpio, sin verificación por correo en pruebas internas.",
  },
  {
    title: "Registra al perro",
    text: "Crea su ficha clínica, agrega fotos y enlaza la pechera o collar.",
  },
  {
    title: "Supervisa y actúa",
    text: "Mira métricas, ubicación, alertas y expediente médico en una sola vista.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="relative overflow-hidden rounded-[2.6rem] border border-white/75 bg-[linear-gradient(145deg,#111922_0%,#182532_42%,#0f1720_100%)] p-6 text-white shadow-[0_24px_70px_rgba(11,27,40,0.18)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_26%),radial-gradient(circle_at_15%_80%,_rgba(28,110,140,0.28),_transparent_30%),radial-gradient(circle_at_78%_24%,_rgba(138,90,52,0.22),_transparent_18%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma clínica para perros conectados
            </p>
            <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[0.95] sm:text-6xl lg:text-[4.5rem]">
              Monitoreo wearable e IA para cuidar a quienes nos cuidan.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              PolyLuk convierte pecheras inteligentes en un sistema de captura, análisis y alerta para perros de servicio, rescate y hogar.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Enfoque
                </p>
                <p className="mt-2 text-sm font-semibold text-white">Clínico, editorial y directo</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Flujo
                </p>
                <p className="mt-2 text-sm font-semibold text-white">Captura, análisis y alerta</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Bucket
                </p>
                <p className="mt-2 text-sm font-semibold text-white">dog-photos privado</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Acceso rápido
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Empieza en menos de un minuto
                </h2>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                Responsive
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-foreground transition hover:bg-[#f4ede3]"
              >
                Crear cuenta
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Entrar
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-[#1f3443] px-5 text-sm font-bold text-white transition hover:bg-[#253d4f]"
              >
                Ver panel
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {pipelineStages.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="rounded-[1.65rem] border border-white/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f6efe5_100%)] p-5 shadow-[0_16px_40px_rgba(11,27,40,0.08)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/12 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="rounded-[1.65rem] border border-white/80 bg-[linear-gradient(180deg,#fffdf9_0%,#f6efe5_100%)] p-5 shadow-[0_16px_40px_rgba(11,27,40,0.08)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/12 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Tres líneas de producto</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">Una misma plataforma, tres contextos reales.</h2>
          <p className="mt-3 text-sm leading-6 text-muted">La propuesta cubre hogar, asistencia y operaciones de alto desgaste con el mismo núcleo de monitoreo.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {productLines.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-[1.55rem] border border-border bg-soft p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{item.title}</p>
                  <p className="mt-2 text-lg font-bold text-foreground">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(145deg,#13202b_0%,#203241_100%)] p-6 text-white shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Impacto</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white">Protege inversión, autonomía y respuesta temprana.</h2>
          <div className="mt-6 grid gap-3">
            {impact.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-[1.45rem] border border-white/10 bg-white/8 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{item.title}</p>
                  <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Puesta en marcha</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">Lo que necesitas para probar sin fricción.</h2>
        <div className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-3 rounded-[1.35rem] bg-soft px-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">
                0{index + 1}
              </div>
              <div>
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
