import type { ReactNode } from 'react';

export default function AuthBrandPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex h-full w-full flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#3c5b7d] via-[#334F70] to-[#263d59] px-8 py-12 text-center text-[#F3F3F4]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 -top-32 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10" />
        <div className="absolute -bottom-36 -left-28 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute left-[18%] top-[18%] h-2 w-2 rounded-full bg-[#C8D8E8]/70" />
        <div className="absolute left-[23%] top-[18%] h-2 w-2 rounded-full bg-[#C8D8E8]/30" />
        <div className="absolute left-[18%] top-[23%] h-2 w-2 rounded-full bg-[#C8D8E8]/30" />
        <div className="absolute bottom-[18%] right-[16%] h-14 w-14 rotate-12 rounded-2xl border border-white/10" />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-3">
        <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#DCE8F4]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#9FC3EA]" />
          UKM DEBAT · UNIDA GONTOR
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Debat Platform</h1>
        <p className="mx-auto max-w-xs text-sm font-medium leading-relaxed text-[#C8D8E8] sm:text-base">
          Latihan Debat Kapan Saja, Di Mana Saja
        </p>
        {children}
      </div>
    </div>
  );
}
