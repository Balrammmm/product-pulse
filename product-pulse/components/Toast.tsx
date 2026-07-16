"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3600);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-surface fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink shadow-lift">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-moss text-linen shadow-card">
        <span className="h-2 w-2 rounded-full bg-linen" />
      </span>
      <span className="leading-5">{message}</span>
    </div>
  );
}
