import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    username: string;
    avatar_url: string | null;
  };
}

export const usePosts = (userId?: string) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data: postsData, error } = await query;

      if (error) throw error;

      // Fetch profiles for each post
      const userIds = [...new Set(postsData?.map(p => p.user_id) || [])];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      
      const postsWithProfiles = (postsData || []).map(post => ({
        ...post,
        profile: profilesMap.get(post.user_id) || undefined,
      }));

      setPosts(postsWithProfiles);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const createPost = async (imageFile: File, caption: string) => {
    if (!user?.uid) return { error: "Not authenticated" };

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.uid}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, imageFile);

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.uid,
        image_url: urlData.publicUrl,
        caption,
      })
      .select()
      .single();

    return { data, error };
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    return { error };
  };

  return { posts, loading, error, createPost, deletePost, refetch: fetchPosts };
};
