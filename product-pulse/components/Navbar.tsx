import Link from "next/link";
import { SampleReportPicker } from "./SampleReportPicker";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/[0.06] bg-linen/86 shadow-[0_1px_0_rgba(255,255,255,0.75)_inset] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="ProductPulse home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/10 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:rotate-[-2deg] group-hover:border-moss/30 group-hover:shadow-card group-active:scale-95">
            <svg
              aria-hidden="true"
              className="logo-pulse h-4 w-4 text-moss"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 13h3.2l2.1-5.5 3.5 10 3-13 2.6 8.5H21"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-[0.01em] text-ink">ProductPulse</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <SampleReportPicker variant="ghost" className="hidden sm:inline-flex" />
          <Link
            href="/upload"
            className="btn-primary rounded-full px-4 py-2 font-medium"
          >
            Analyze Reviews
          </Link>
        </nav>
      </div>
    </header>
  );
}
