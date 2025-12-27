-- Create likes table
CREATE TABLE public.likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Enable RLS on likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create comments table
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert likes" 
ON public.likes FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete likes" 
ON public.likes FOR DELETE 
USING (true);

-- RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert comments" 
ON public.comments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update comments" 
ON public.comments FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete comments" 
ON public.comments FOR DELETE 
USING (true);

-- Add trigger for comments updated_at
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for likes and comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;