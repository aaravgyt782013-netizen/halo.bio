import { type ReactNode, isValidElement } from "react";
import { DashboardBadgesPortal } from "@/components/DashboardBadgesPortal";
import type { Profile } from "@/lib/bio";

/** iOS-style device frame used for the live preview in the builder. Fully responsive on mobile. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const child = isValidElement(children) ? children : null;
  const profile = child ? (child.props as { profile?: Profile }).profile : undefined;
  return (
    <div className="relative mx-auto w-full max-w-[340px] px-2 sm:px-0">
      <div className="relative rounded-[2.5rem] sm:rounded-[3.2rem] border border-border bg-foreground/90 p-2 sm:p-[10px] shadow-lift">
        <div className="relative h-[580px] sm:h-[660px] w-full overflow-hidden rounded-[2rem] sm:rounded-[2.7rem] bg-background">
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-5 w-20 sm:h-6 sm:w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
          {children}
        </div>
      </div>
      {profile && <DashboardBadgesPortal profile={profile} />}
    </div>
  );
}
