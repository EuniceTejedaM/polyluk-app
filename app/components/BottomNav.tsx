"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, PawPrint, UserRound, Store } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Perros", icon: PawPrint },
  { href: "/alertas", label: "Alertas", icon: Bell },
  { href: "/tienda", label: "Tienda", icon: Store },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/75 bg-white/92 px-2 py-2 shadow-[0_18px_45px_rgba(11,27,40,0.12)] backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-2">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-[1.35rem] px-3 py-3 text-xs font-semibold transition duration-200 ${
                  active
                    ? "bg-brand/12 text-brand shadow-[0_10px_24px_rgba(0,163,224,0.14)]"
                    : "text-muted hover:bg-soft hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-brand" : "text-muted"}`} strokeWidth={2.2} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}