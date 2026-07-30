-- ====================================================================
-- SCRIPT DE BASE DE DATOS PARA SUPABASE - SURY APP (Date Tracker)
-- ====================================================================

-- 1. Crear la tabla principal para las citas/ideas
-- Se usan nombres en "camelCase" (entre comillas dobles) para los campos
-- que lo requieran. Así coinciden exactamente con tu código de React (Firebase) 
-- y no tienes que renombrar tus variables en el frontend.
CREATE TABLE public.dates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  "photoUrl" text,
  "magicStyle" text,
  "completedAt" timestamp with time zone,
  "createdAt" timestamp with time zone DEFAULT now()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.dates ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso (RLS) para la tabla 'dates'
-- Nota: Para simplificar el prototipo, daremos acceso a usuarios anónimos (anon). 
-- Si después agregas login (Auth), estas reglas aplican también para 'authenticated'.
CREATE POLICY "Permitir lectura a todos" 
ON public.dates FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir inserción a todos" 
ON public.dates FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Permitir actualización a todos" 
ON public.dates FOR UPDATE 
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir eliminación a todos" 
ON public.dates FOR DELETE 
TO anon, authenticated
USING (true);

-- ====================================================================
-- SCRIPT PARA SUPABASE STORAGE (BUCKETS)
-- ====================================================================

-- 4. Crear el bucket público para guardar las fotos (date-photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('date-photos', 'date-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Políticas de acceso (RLS) para el bucket 'date-photos'
-- Permitir que cualquiera pueda ver las imágenes (SELECT)
CREATE POLICY "Imágenes públicas" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'date-photos');

-- Permitir que cualquiera pueda subir imágenes (INSERT)
CREATE POLICY "Permitir subida de imágenes" 
ON storage.objects FOR INSERT 
TO anon, authenticated
WITH CHECK (bucket_id = 'date-photos');

-- Permitir actualización de imágenes (UPDATE)
CREATE POLICY "Permitir actualizar imágenes" 
ON storage.objects FOR UPDATE 
TO anon, authenticated
USING (bucket_id = 'date-photos');

-- Permitir eliminación de imágenes (DELETE)
CREATE POLICY "Permitir eliminar imágenes" 
ON storage.objects FOR DELETE 
TO anon, authenticated
USING (bucket_id = 'date-photos');
