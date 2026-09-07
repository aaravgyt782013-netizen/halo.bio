import { type ReactNode } from "react";

/** iOS-style device frame used for the live preview in the builder. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[330px]">
      <div className="relative rounded-[3.2rem] border border-border bg-foreground/90 p-[10px] shadow-lift">
        <div className="relative h-[660px] w-full overflow-hidden rounded-[2.7rem] bg-background">
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
          {children}
        </div>
      </div>
    </div>
  );
}
