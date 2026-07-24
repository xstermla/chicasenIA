-- Link (Drive, YouTube, etc.) al video del pitch de 60 segundos, en vez de
-- subir el archivo de video directo (evita costos y límites de storage).
alter table projects add column if not exists pitch_video_link text;
