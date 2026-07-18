import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// Cliente con la service_role key: ignora RLS. Se usa exclusivamente desde
// Server Actions / Route Handlers para las operaciones de los equipos
// (que no tienen cuenta de Auth y solo se identifican con su access_code).
// El import "server-only" hace fallar el build si esto se importa desde
// un Client Component.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
