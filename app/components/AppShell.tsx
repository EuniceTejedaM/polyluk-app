"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthOrLandingRoute =
    pathname === "/" ||
    pathname === "/landing" ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <main
        className={`mx-auto flex min-h-screen w-full flex-col ${
          isAuthOrLandingRoute
            ? "max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
            : "max-w-7xl px-4 pb-32 pt-4 sm:px-6 lg:px-8"
        }`}
      >
        {children}
      </main>
      {!isAuthOrLandingRoute ? <BottomNav /> : null}
    </div>
  );
}