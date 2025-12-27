-- First drop all foreign key constraints
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Drop existing RLS policies on tables
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON public.posts;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can delete profiles" ON public.profiles;

-- Change user_id column type from UUID to TEXT for posts
ALTER TABLE public.posts ALTER COLUMN user_id TYPE text;

-- Change user_id column type from UUID to TEXT for profiles
ALTER TABLE public.profiles ALTER COLUMN user_id TYPE text;

-- Create new RLS policies - allow all operations (Firebase handles auth)
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert posts" 
ON public.posts FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update posts" 
ON public.posts FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete posts" 
ON public.posts FOR DELETE 
USING (true);

CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update profiles" 
ON public.profiles FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete profiles" 
ON public.profiles FOR DELETE 
USING (true);

-- Update storage policies
DROP POLICY IF EXISTS "Users can upload their own posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own posts" ON storage.objects;
DROP POLICY IF EXISTS "Post images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload posts" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update post files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete post files" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update avatar files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete avatar files" ON storage.objects;

-- Create unified storage policies
CREATE POLICY "Storage objects are publicly accessible" 
ON storage.objects FOR SELECT 
USING (true);

CREATE POLICY "Anyone can upload to storage" 
ON storage.objects FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update storage objects" 
ON storage.objects FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete storage objects" 
ON storage.objects FOR DELETE 
USING (true);