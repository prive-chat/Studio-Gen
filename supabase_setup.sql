-- SQL Master Script para StudioGen AI
-- Ejecuta este script en el Editor SQL de tu proyecto de Supabase (https://app.supabase.com)

-- 1. Crear tabla de Generaciones
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    prompt TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    script TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Habilitar Seguridad de Nivel de Fila (RLS)
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas de Acceso (Solo el dueño puede ver/borrar/insertar sus datos)
CREATE POLICY "Users can view their own generations" 
ON public.generations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations" 
ON public.generations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations" 
ON public.generations FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Crear Bucket de Almacenamiento para los Assets
-- Nota: Esto asume que tienes permisos para crear buckets via SQL o que lo harás manualmente.
-- Si falla, crea el bucket 'gallery_assets' manualmente en el panel de Storage.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery_assets', 'gallery_assets', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Políticas de Almacenamiento (Storage RLS)
CREATE POLICY "Public Access to Assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery_assets');

CREATE POLICY "Users can upload their own assets" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'gallery_assets' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own assets" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'gallery_assets' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Habilitar Tiempo Real (Realtime) para la tabla de generaciones
-- Esto permite que la app se actualice instantáneamente en todos los dispositivos.
ALTER PUBLICATION supabase_realtime ADD TABLE public.generations;
