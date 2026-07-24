-- Agrega país y ciudad a las instituciones (se cargan desde el registro
-- de equipo, junto con el nombre de la institución).
alter table institutions add column if not exists country text;
alter table institutions add column if not exists city text;
