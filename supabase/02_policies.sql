-- Chicas en IA — Row Level Security
-- Modelo de acceso:
--  * Los equipos (estudiantes) NO tienen cuenta de Auth. Todo lo que hacen
--    (registrarse, guardar pasos, subir el boceto, enviar el proyecto) pasa
--    por Server Actions de Next.js que validan el access_code y usan la
--    service_role key (que ignora RLS). Por eso anon NO tiene grants sobre
--    teams/projects/evaluations.
--  * Docentes/evaluadoras/admin usan Supabase Auth y quedan acotadas a su
--    institución mediante profiles.institution_id.

alter table institutions enable row level security;
alter table cohorts enable row level security;
alter table profiles enable row level security;
alter table teams enable row level security;
alter table projects enable row level security;
alter table evaluations enable row level security;

-- Funciones auxiliares (security definer para evitar recursión de RLS al
-- consultar profiles desde las políticas de otras tablas).
create or replace function is_admin()
returns boolean
language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function my_institution_id()
returns uuid
language sql security definer stable set search_path = public as $$
  select institution_id from profiles where id = auth.uid();
$$;

-- ---------- profiles ----------
-- Cada usuaria ve su propio perfil; admin ve todos.
create policy profiles_select on profiles for select
  using (id = auth.uid() or is_admin());

-- Solo admin asigna institución/rol (las cuentas se crean por invitación).
create policy profiles_update_admin on profiles for update
  using (is_admin()) with check (is_admin());

-- ---------- institutions ----------
create policy institutions_select on institutions for select
  using (is_admin() or id = my_institution_id());

create policy institutions_admin_write on institutions for all
  using (is_admin()) with check (is_admin());

-- ---------- cohorts ----------
create policy cohorts_select on cohorts for select
  using (is_admin() or institution_id = my_institution_id());

create policy cohorts_admin_write on cohorts for all
  using (is_admin()) with check (is_admin());

-- ---------- teams ----------
-- El alta de equipos la hace el server action (service_role). Docentes y
-- evaluadoras solo leen los equipos de su propia institución.
create policy teams_select on teams for select
  using (
    is_admin()
    or cohort_id in (select id from cohorts where institution_id = my_institution_id())
  );

create policy teams_admin_write on teams for all
  using (is_admin()) with check (is_admin());

-- ---------- projects ----------
create policy projects_select on projects for select
  using (
    is_admin()
    or team_id in (
      select t.id from teams t
      join cohorts c on c.id = t.cohort_id
      where c.institution_id = my_institution_id()
    )
  );

-- Permite a la docente/evaluadora reabrir un proyecto enviado (status -> borrador).
create policy projects_update on projects for update
  using (
    is_admin()
    or team_id in (
      select t.id from teams t
      join cohorts c on c.id = t.cohort_id
      where c.institution_id = my_institution_id()
    )
  )
  with check (
    is_admin()
    or team_id in (
      select t.id from teams t
      join cohorts c on c.id = t.cohort_id
      where c.institution_id = my_institution_id()
    )
  );

-- ---------- evaluations ----------
create policy evaluations_select on evaluations for select
  using (
    is_admin()
    or project_id in (
      select p.id from projects p
      join teams t on t.id = p.team_id
      join cohorts c on c.id = t.cohort_id
      where c.institution_id = my_institution_id()
    )
  );

create policy evaluations_insert on evaluations for insert
  with check (
    evaluator_id = auth.uid()
    and (
      is_admin()
      or project_id in (
        select p.id from projects p
        join teams t on t.id = p.team_id
        join cohorts c on c.id = t.cohort_id
        where c.institution_id = my_institution_id()
      )
    )
  );

create policy evaluations_update on evaluations for update
  using (evaluator_id = auth.uid() or is_admin())
  with check (evaluator_id = auth.uid() or is_admin());

-- ---------- grants ----------
-- anon: sin acceso a tablas base sensibles. Solo puede leer las vistas
-- públicas (sin datos de contacto) que alimentan los selectores del
-- formulario de registro de equipo.
revoke all on institutions, cohorts, profiles, teams, projects, evaluations from anon;
grant select on institutions_public, cohorts_public to anon, authenticated;

grant select, update on profiles to authenticated;
grant select on institutions, cohorts to authenticated;
grant update on institutions, cohorts to authenticated;
grant select, update on teams to authenticated;
grant select, update on projects to authenticated;
grant select, insert, update on evaluations to authenticated;
