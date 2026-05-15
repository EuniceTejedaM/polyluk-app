import type { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-4 pb-36 pt-4 sm:px-5">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}