-- Chicas en IA — Storage
-- Bucket privado para los bocetos. No se crean policies de storage.objects:
-- toda subida y toda lectura (URL firmada) se hace desde Server Actions con
-- la service_role key, que ignora RLS. Así el bucket nunca queda listable
-- ni accesible de forma pública ni desde el navegador con la anon key.

insert into storage.buckets (id, name, public)
values ('bocetos', 'bocetos', false)
on conflict (id) do nothing;
