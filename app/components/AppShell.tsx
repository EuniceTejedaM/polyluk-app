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
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(28,110,140,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(138,90,52,0.12),transparent_26%),radial-gradient(circle_at_bottom_center,rgba(15,23,32,0.06),transparent_32%),linear-gradient(180deg,#f9f4ed_0%,#f2eadf_48%,#ede2d4_100%)]"
      />
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