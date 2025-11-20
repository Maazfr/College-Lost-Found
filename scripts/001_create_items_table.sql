-- Create the items table for lost and found items
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  date_reported DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('lost', 'found', 'claimed')),
  image_url TEXT,
  contact_info TEXT NOT NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Create policies for CRUD operations
CREATE POLICY "items_select_all" 
  ON public.items FOR SELECT 
  USING (true); -- Anyone can view items

CREATE POLICY "items_insert_own" 
  ON public.items FOR INSERT 
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "items_update_own" 
  ON public.items FOR UPDATE 
  USING (auth.uid() = reporter_id);

CREATE POLICY "items_delete_own" 
  ON public.items FOR DELETE 
  USING (auth.uid() = reporter_id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS items_status_idx ON public.items(status);
CREATE INDEX IF NOT EXISTS items_category_idx ON public.items(category);
CREATE INDEX IF NOT EXISTS items_date_reported_idx ON public.items(date_reported);
