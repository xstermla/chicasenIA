// Tipos manuales que reflejan supabase/01_schema.sql.
// Si en el futuro corres `supabase gen types typescript`, puedes reemplazar
// este archivo por el generado (la forma es compatible).
//
// Nota importante: dentro de `Database`, Row/Insert/Update de cada tabla
// están escritos como literales inline, NO como referencias a las
// interfaces exportadas más abajo (ni como `Partial<Interfaz>`). Así es
// como los genera `supabase gen types`, y es a propósito: referenciar un
// tipo con nombre (interface o type alias) ahí rompe la inferencia de
// `.select()` / `.update()` / `.insert()` en @supabase/postgrest-js — TS
// termina resolviendo el resultado a `never`. Las interfaces exportadas
// son solo para tipar props/parámetros en el resto de la app (son
// estructuralmente iguales, así que siguen siendo compatibles).

export type Role = "docente" | "evaluadora" | "admin";
export type ProjectStatus = "borrador" | "enviado";
export type PrototipoTipo = "papel" | "canva" | "figma" | "replit";

export interface Institution {
  id: string;
  name: string;
  contact_teacher_name: string | null;
  contact_email: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
}

export interface InstitutionPublic {
  id: string;
  name: string;
}

export interface Cohort {
  id: string;
  institution_id: string;
  name: string;
  demo_day_date: string | null;
  created_at: string;
}

export interface CohortPublic {
  id: string;
  institution_id: string;
  name: string;
  demo_day_date: string | null;
}

export interface Profile {
  id: string;
  institution_id: string | null;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface Team {
  id: string;
  cohort_id: string;
  team_name: string;
  members: string[] | null;
  access_code: string;
  created_at: string;
}

export interface Project {
  id: string;
  team_id: string;
  problema: string | null;
  para_quien: string | null;
  ia_funciones: string[] | null;
  ia_otra: string | null;
  boceto_url: string | null;
  nombre_app: string | null;
  nombre_por_que: string | null;
  pitch_se_llama: string | null;
  pitch_la_creamos_para: string | null;
  pitch_problema_resuelve: string | null;
  pitch_ia_adentro: string | null;
  pitch_se_llama_asi_porque: string | null;
  pitch_video_link: string | null;
  ods: string | null;
  evidencia_indagacion: string | null;
  ficha_usuario: string | null;
  prototipo_tipo: PrototipoTipo | null;
  prototipo_link: string | null;
  status: ProjectStatus;
  submitted_at: string | null;
  updated_at: string;
}

export interface Evaluation {
  id: string;
  project_id: string;
  evaluator_id: string;
  score_eje1: number | null;
  score_eje2: number | null;
  score_eje3: number | null;
  score_eje4: number | null;
  feedback_eje1: string | null;
  feedback_eje2: string | null;
  feedback_eje3: string | null;
  feedback_eje4: string | null;
  total_score: number;
  created_at: string;
}

// Shape mínima que espera @supabase/ssr / @supabase/supabase-js; no
// reemplaza una generación real de tipos pero alcanza para tipar los
// clientes de este proyecto.
export interface Database {
  public: {
    Tables: {
      institutions: {
        Row: {
          id: string;
          name: string;
          contact_teacher_name: string | null;
          contact_email: string | null;
          country: string | null;
          city: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_teacher_name?: string | null;
          contact_email?: string | null;
          country?: string | null;
          city?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_teacher_name?: string | null;
          contact_email?: string | null;
          country?: string | null;
          city?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      cohorts: {
        Row: {
          id: string;
          institution_id: string;
          name: string;
          demo_day_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          name: string;
          demo_day_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string;
          name?: string;
          demo_day_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          institution_id: string | null;
          full_name: string | null;
          role: Role;
          created_at: string;
        };
        Insert: {
          id: string;
          institution_id?: string | null;
          full_name?: string | null;
          role?: Role;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string | null;
          full_name?: string | null;
          role?: Role;
          created_at?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          cohort_id: string;
          team_name: string;
          members: string[] | null;
          access_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cohort_id: string;
          team_name: string;
          members?: string[] | null;
          access_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cohort_id?: string;
          team_name?: string;
          members?: string[] | null;
          access_code?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          team_id: string;
          problema: string | null;
          para_quien: string | null;
          ia_funciones: string[] | null;
          ia_otra: string | null;
          boceto_url: string | null;
          nombre_app: string | null;
          nombre_por_que: string | null;
          pitch_se_llama: string | null;
          pitch_la_creamos_para: string | null;
          pitch_problema_resuelve: string | null;
          pitch_ia_adentro: string | null;
          pitch_se_llama_asi_porque: string | null;
          pitch_video_link: string | null;
          ods: string | null;
          evidencia_indagacion: string | null;
          ficha_usuario: string | null;
          prototipo_tipo: PrototipoTipo | null;
          prototipo_link: string | null;
          status: ProjectStatus;
          submitted_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          problema?: string | null;
          para_quien?: string | null;
          ia_funciones?: string[] | null;
          ia_otra?: string | null;
          boceto_url?: string | null;
          nombre_app?: string | null;
          nombre_por_que?: string | null;
          pitch_se_llama?: string | null;
          pitch_la_creamos_para?: string | null;
          pitch_problema_resuelve?: string | null;
          pitch_ia_adentro?: string | null;
          pitch_se_llama_asi_porque?: string | null;
          pitch_video_link?: string | null;
          ods?: string | null;
          evidencia_indagacion?: string | null;
          ficha_usuario?: string | null;
          prototipo_tipo?: PrototipoTipo | null;
          prototipo_link?: string | null;
          status?: ProjectStatus;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          problema?: string | null;
          para_quien?: string | null;
          ia_funciones?: string[] | null;
          ia_otra?: string | null;
          boceto_url?: string | null;
          nombre_app?: string | null;
          nombre_por_que?: string | null;
          pitch_se_llama?: string | null;
          pitch_la_creamos_para?: string | null;
          pitch_problema_resuelve?: string | null;
          pitch_ia_adentro?: string | null;
          pitch_se_llama_asi_porque?: string | null;
          pitch_video_link?: string | null;
          ods?: string | null;
          evidencia_indagacion?: string | null;
          ficha_usuario?: string | null;
          prototipo_tipo?: PrototipoTipo | null;
          prototipo_link?: string | null;
          status?: ProjectStatus;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      evaluations: {
        Row: {
          id: string;
          project_id: string;
          evaluator_id: string;
          score_eje1: number | null;
          score_eje2: number | null;
          score_eje3: number | null;
          score_eje4: number | null;
          feedback_eje1: string | null;
          feedback_eje2: string | null;
          feedback_eje3: string | null;
          feedback_eje4: string | null;
          total_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          evaluator_id: string;
          score_eje1?: number | null;
          score_eje2?: number | null;
          score_eje3?: number | null;
          score_eje4?: number | null;
          feedback_eje1?: string | null;
          feedback_eje2?: string | null;
          feedback_eje3?: string | null;
          feedback_eje4?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          evaluator_id?: string;
          score_eje1?: number | null;
          score_eje2?: number | null;
          score_eje3?: number | null;
          score_eje4?: number | null;
          feedback_eje1?: string | null;
          feedback_eje2?: string | null;
          feedback_eje3?: string | null;
          feedback_eje4?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      institutions_public: {
        Row: { id: string; name: string };
        Relationships: [];
      };
      cohorts_public: {
        Row: {
          id: string;
          institution_id: string;
          name: string;
          demo_day_date: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
