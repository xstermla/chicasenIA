-- Chicas en IA — esquema de base de datos
-- Ejecutar en el SQL editor de Supabase (o vía CLI) en este orden:
-- 01_schema.sql -> 02_policies.sql -> 03_storage.sql

create extension if not exists pgcrypto;

create table institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_teacher_name text,
  contact_email text,
  created_at timestamptz default now()
);

create table cohorts (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references institutions(id) not null,
  name text not null,
  demo_day_date date,
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users(id),
  institution_id uuid references institutions(id),
  full_name text,
  role text check (role in ('docente', 'evaluadora', 'admin')) default 'docente',
  created_at timestamptz default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references cohorts(id) not null,
  team_name text not null,
  members text[],
  access_code text unique not null,
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) unique not null,
  problema text,
  para_quien text,
  ia_funciones text[],
  ia_otra text,
  boceto_url text,
  nombre_app text,
  nombre_por_que text,
  pitch_se_llama text,
  pitch_la_creamos_para text,
  pitch_problema_resuelve text,
  pitch_ia_adentro text,
  pitch_se_llama_asi_porque text,
  ods text,
  evidencia_indagacion text,
  ficha_usuario text,
  prototipo_tipo text check (prototipo_tipo in ('papel','canva','figma','replit')),
  prototipo_link text,
  status text check (status in ('borrador','enviado')) default 'borrador',
  submitted_at timestamptz,
  updated_at timestamptz default now()
);

create table evaluations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) not null,
  evaluator_id uuid references profiles(id) not null,
  score_eje1 int check (score_eje1 between 1 and 3),
  score_eje2 int check (score_eje2 between 1 and 3),
  score_eje3 int check (score_eje3 between 1 and 3),
  score_eje4 int check (score_eje4 between 1 and 3),
  feedback_eje1 text,
  feedback_eje2 text,
  feedback_eje3 text,
  feedback_eje4 text,
  total_score int generated always as (
    coalesce(score_eje1,0) + coalesce(score_eje2,0) + coalesce(score_eje3,0) + coalesce(score_eje4,0)
  ) stored,
  created_at timestamptz default now()
);

-- Índices de apoyo para los joins de RLS y las listas del panel
create index idx_cohorts_institution on cohorts(institution_id);
create index idx_profiles_institution on profiles(institution_id);
create index idx_teams_cohort on teams(cohort_id);
create index idx_teams_access_code on teams(access_code);
create index idx_projects_team on projects(team_id);
create index idx_projects_status on projects(status);
create index idx_evaluations_project on evaluations(project_id);
create index idx_evaluations_evaluator on evaluations(evaluator_id);

-- updated_at automático en projects
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_projects_updated_at
before update on projects
for each row execute function set_updated_at();

-- Vistas públicas para el registro de equipo (sin datos de contacto)
create view institutions_public as
  select id, name from institutions;

create view cohorts_public as
  select id, institution_id, name, demo_day_date from cohorts;

-- Al crear una cuenta de Auth (invitación manual desde el dashboard de Supabase),
-- se crea automáticamente una fila vacía en profiles. Un admin debe luego
-- asignarle institution_id y role.
create or replace function handle_new_auth_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'docente')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function handle_new_auth_user();
