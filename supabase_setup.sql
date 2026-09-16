-- Script de Criação da Tabela 'subscribers' no Supabase
-- Copie e cole este código no SQL Editor do seu projeto Supabase

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública dos formulários da Landing Page
CREATE POLICY "Permitir inserções públicas de inscritos" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir leitura dos inscritos pelo dashboard
CREATE POLICY "Permitir leitura de inscritos" 
ON public.subscribers 
FOR SELECT 
USING (true);