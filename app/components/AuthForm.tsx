"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      if (isRegister) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch (formError) {
      setError(formError instanceof Error ? formError.message : "No se pudo completar la operación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_20px_50px_rgba(11,27,40,0.08)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
          {isRegister ? "Crear cuenta" : "Bienvenido de vuelta"}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">
          {isRegister ? "Registrar usuario" : "Iniciar sesión"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {isRegister
            ? "Crea tu cuenta para registrar perros, vincular dispositivos y gestionar alertas."
            : "Accede a tu panel para ver perros, alertas y datos biométricos."}
        </p>
      </div>

      {isRegister ? (
        <label className="block text-sm font-semibold text-foreground">
          Nombre
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Tu nombre"
            className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
          />
        </label>
      ) : null}

      <label className="block text-sm font-semibold text-foreground">
        Correo electrónico
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
        />
      </label>

      <label className="block text-sm font-semibold text-foreground">
        Contraseña
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          placeholder="••••••••"
          className="mt-2 h-12 w-full rounded-[1rem] border border-border bg-soft px-4 text-base text-foreground outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
        />
      </label>

      {error ? (
        <div className="rounded-[1rem] border border-alert/20 bg-alert/6 px-4 py-3 text-sm text-alert">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-[1rem] bg-brand text-base font-bold text-white shadow-[0_16px_30px_rgba(0,163,224,0.25)] transition hover:bg-[#0094cb] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Procesando..." : isRegister ? "Crear cuenta" : "Entrar"}
      </button>

      <p className="text-center text-sm text-muted">
        {isRegister ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-semibold text-brand transition hover:text-foreground"
        >
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </Link>
      </p>
    </form>
  );
}