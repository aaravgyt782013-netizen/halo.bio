import { auth, db } from "@/lib/bio";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = {
  auth,
  from: (table: "profiles" | "links" | "user_roles") => db.from(table),
  rpc: (fn: string, args?: Record<string, unknown>) => db.rpc(fn, args),
  storage: {
    from: () => ({
      upload: async () => ({ error: null }),
      createSignedUrl: async () => ({ data: { signedUrl: "" }, error: null }),
    }),
  },
};
