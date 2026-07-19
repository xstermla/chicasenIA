# Chicas en IA — Mi idea de app con IA

Web app para gestionar los proyectos de los equipos de estudiantes (13–18
años) de Chicas en IA (XSTEM + IBM SkillsBuild): cargan su idea de app con
IA desde el celular y las docentes/evaluadoras la evalúan con una rúbrica de
4 ejes.

Stack: Next.js (App Router) + Tailwind CSS + Supabase (Postgres + Auth +
Storage).

## 1. Crear el proyecto de Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecutá en este orden los archivos de `supabase/`:
   1. `01_schema.sql`
   2. `02_policies.sql`
   3. `03_storage.sql`
3. En **Project Settings → API** copiá `Project URL`, `anon public key` y
   `service_role key`.

## 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Completá `.env.local` con los 3 valores del paso anterior.
`SUPABASE_SERVICE_ROLE_KEY` **nunca** se expone al navegador: solo se usa
desde Server Actions / Route Handlers (ver `src/lib/supabase/admin.ts`).

## 3. Instalar y correr en desarrollo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## 4. Cargar datos iniciales (instituciones, cohortes y cuentas)

Los equipos se registran solos desde `/registro`, pero **instituciones**,
**cohortes** y las **cuentas de docente/evaluadora/admin** las crea el
equipo del programa manualmente (no hay alta pública para no exponer datos
de contacto ni permitir instituciones falsas):

1. Insertá instituciones y cohortes desde el **Table Editor** de Supabase
   (tablas `institutions` y `cohorts`).
2. Creá cada cuenta de docente/evaluadora desde **Authentication → Users →
   Invite user** (o Add user) con su email.
   - Al crearse el `auth.users`, un trigger (`handle_new_auth_user`, ver
     `01_schema.sql`) crea automáticamente su fila en `profiles` con
     `role = 'docente'`.
   - Como admin, editá esa fila en `profiles` para asignarle
     `institution_id` (la institución que le corresponde) y ajustar
     `role` a `'docente'`, `'evaluadora'` o `'admin'` según corresponda.
   - Una cuenta `admin` no necesita `institution_id`: ve todas las
     instituciones.

## 5. Cómo funciona el acceso (para tener en cuenta al probar)

- **Equipos (estudiantes):** no tienen cuenta de Auth. Se identifican solo
  con su `access_code` de 6 caracteres. Todo el flujo de
  `/proyecto/[code]/...` valida ese código en el servidor
  (`src/app/proyecto/[code]/data.ts`) usando la `service_role key`, que
  ignora RLS — por eso el rol `anon` no tiene ningún permiso directo sobre
  `teams`/`projects`/`evaluations` (ver comentarios en
  `supabase/02_policies.sql`).
- **Docentes/evaluadoras/admin:** usan Supabase Auth y quedan acotadas a su
  institución por RLS (`profiles.institution_id`). El admin ve todo.
- **Bocetos:** bucket `bocetos` privado, sin políticas propias. Las URLs
  para ver la imagen se generan siempre con `service_role` y expiran a los
  10 minutos (no son públicas ni listables).

## 6. Probar el flujo completo

1. `/` → **Registrar mi equipo** → completá el formulario → anotá el
   código de acceso que te muestra.
2. Con ese código, entrá a `/proyecto/<CODIGO>` y completá los 5 pasos +
   el pitch. Probá subir una foto del boceto desde el celular (el input
   abre la cámara directamente en mobile).
3. Enviá el proyecto (botón **Enviar proyecto** al final del pitch).
4. Como docente/evaluadora, andá a `/login`, ingresá, y en `/panel` vas a
   ver ese equipo con estado "Enviado". Abrilo, completá la rúbrica (el
   puntaje y la escala se recalculan en vivo) y guardá.
5. Desde `/panel` (rol docente o admin) probá **Exportar a Excel**.

## Estructura del proyecto

```
supabase/               SQL: schema, RLS policies, bucket de storage
src/lib/supabase/       Clientes de Supabase (browser, server/sesión, admin)
src/lib/database.types.ts  Tipos de la base (ver nota sobre Insert/Update inline)
src/lib/rubrica.ts       Rúbrica y banco de feedback (texto literal del programa)
src/lib/access-code.ts   Generador del código de acceso de los equipos
src/app/registro/        Alta de equipo (genera access_code)
src/app/proyecto/[code]/ Formulario de 5 pasos + pitch + envío (sin Auth, por código)
src/app/login/           Login docente/evaluadora (Supabase Auth)
src/app/panel/           Lista de equipos, detalle + rúbrica, export a Excel
src/proxy.ts             Antes "middleware": refresca sesión y protege /panel
```

## Notas técnicas

- **Insert/Update inline en `database.types.ts`:** están escritos como
  literales inline (no `Partial<Interfaz>`) a propósito — referenciar un
  tipo con nombre ahí rompe la inferencia de `.select()/.update()/.insert()`
  de `@supabase/postgrest-js` (termina resolviendo a `never`). Si en algún
  momento corrés `supabase gen types typescript`, el archivo generado tiene
  esta misma forma y podés reemplazarlo directamente.
- **Reabrir un proyecto enviado:** solo docente o admin (no evaluadora)
  pueden reabrirlo desde el botón "Reabrir para editar" en el detalle del
  proyecto — vuelve el `status` a `'borrador'` para que el equipo pueda
  seguir editando con su mismo código.

## Deploy en proyectos.xstemla.com

La app vive en el subdominio **proyectos.xstemla.com** (se probó primero
servirla en `xstemla.com/proyectos` vía reverse proxy en el `.htaccess` de
cPanel, pero el hosting de GoDaddy —corre LiteSpeed— no soporta el flag de
proxy en `.htaccess`; la alternativa con Cloudflare Worker habría requerido
migrar los nameservers y, con ellos, todo el DNS de email de la
organización (MX/DKIM/SPF de Google Workspace), así que se optó por el
subdominio: mismo resultado para el equipo, cero riesgo para el email).
Son 3 partes:

### A. Supabase (producción)

Igual que en desarrollo (ver arriba), pero en un proyecto Supabase nuevo
para producción: creá el proyecto, corré los 3 SQL de `supabase/` en orden,
y guardá las 3 keys — las vas a necesitar en el paso B.

### B. Deploy del código en Vercel

1. Subí este proyecto a un repo de GitHub (privado está bien):
   ```bash
   git init
   git add .
   git commit -m "Chicas en IA — versión inicial"
   git remote add origin <URL-de-tu-repo-vacío-en-GitHub>
   git push -u origin main
   ```
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importá
   ese repo.
3. En **Environment Variables** cargá las 3 de `.env.local.example` con
   los valores del proyecto Supabase de producción.
4. Deploy. Vercel te da una URL tipo `https://tu-proyecto.vercel.app` —
   probala antes de seguir al paso C.

### C. Conectar proyectos.xstemla.com con esa app

1. En el proyecto de Vercel → **Settings → Domains** → agregá
   `proyectos.xstemla.com`. Vercel te va a mostrar un registro CNAME para
   crear (normalmente apunta a `cname.vercel-dns.com`).
2. En el DNS de GoDaddy (el panel de **DNS Management** del dominio, no
   cPanel) agregá un registro:
   - Tipo: `CNAME`
   - Nombre/Host: `proyectos`
   - Valor: el que te haya dado Vercel
3. Esperá la propagación (unos minutos, a veces hasta un par de horas) y
   Vercel emite el certificado HTTPS automáticamente.

Esto no toca ningún registro existente (MX, SPF, DKIM, ni los otros
subdominios que ya corren en la cuenta) — solo agrega uno nuevo.

### Verificar

- `proyectos.xstemla.com` → landing.
- `proyectos.xstemla.com/registro` → alta de equipo.
- `proyectos.xstemla.com/login` → login docente/evaluadora, y que
  `/panel` te redirija a login si no estás autenticada.
- Probá el flujo completo (sección 6) contra esa URL.
- El resto de xstemla.com sigue funcionando exactamente igual que hoy.
