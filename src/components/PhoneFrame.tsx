import { type ReactNode } from "react";

/** Stable device frame for the dashboard's live profile preview. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] px-2 sm:px-0">
      <div className="relative rounded-[2.5rem] sm:rounded-[3.2rem] border border-border bg-foreground/90 p-2 sm:p-[10px] shadow-lift">
        <div className="relative h-[580px] sm:h-[660px] w-full overflow-hidden rounded-[2rem] sm:rounded-[2.7rem] bg-background">
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-5 w-20 sm:h-6 sm:w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
          <div className="absolute inset-0 min-h-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
