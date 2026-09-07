import { auth, db } from "@/lib/bio";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin: any = {
  auth,
  from: (table: "profiles" | "links" | "user_roles") => db.from(table),
  rpc: (fn: string, args?: Record<string, unknown>) => db.rpc(fn, args),
};
