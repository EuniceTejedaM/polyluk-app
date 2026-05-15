import { AlertTriangle, CircleAlert, Clock3 } from "lucide-react";
import { alerts } from "../mockData";

const severityStyles = {
  critical: {
    border: "border-alert",
    icon: AlertTriangle,
    iconClass: "text-alert",
    badge: "Crítica",
  },
  warning: {
    border: "border-accent",
    icon: CircleAlert,
    iconClass: "text-accent",
    badge: "Advertencia",
  },
} as const;

export default function AlertasPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(11,27,40,0.08)] backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
          Centro de eventos
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">
          Alertas
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Registro simulado de notificaciones críticas y preventivas para la
          salud de los perros.
        </p>
      </section>

      <section className="space-y-3">
        {alerts.map((alert) => {
          const style = severityStyles[alert.severity as keyof typeof severityStyles];
          const Icon = style.icon;

          return (
            <article
              key={alert.id}
              className={`rounded-[1.5rem] border-l-4 ${style.border} bg-white/95 p-4 shadow-[0_12px_28px_rgba(11,27,40,0.07)]`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft ${style.iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        alert.severity === "critical"
                          ? "bg-alert/10 text-alert"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {style.badge}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted">
                      <Clock3 className="h-3.5 w-3.5" />
                      {alert.time}
                    </span>
                  </div>
                  <h2 className="text-base font-bold leading-6 text-foreground">
                    {alert.title}
                  </h2>
                  <p className="text-sm leading-6 text-muted">{alert.detail}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}