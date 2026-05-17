import Link from "next/link";
import AuthForm from "../components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,rgba(11,27,40,0.96),rgba(224,65,228,0.78))] p-6 text-white shadow-[0_20px_50px_rgba(11,27,40,0.16)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
          Nuevo usuario
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-5xl">
          Regístrate y empieza a añadir perros.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/82 sm:text-base">
          El alta queda lista para pruebas locales con verificación desactivada y acceso directo al flujo de dispositivos.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
            Volver al inicio
          </Link>
          <Link href="/login" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-white/92">
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      <AuthForm mode="register" />
    </div>
  );
}