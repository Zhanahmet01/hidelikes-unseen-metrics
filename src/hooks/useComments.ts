import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profile?: {
    username: string;
    avatar_url: string | null;
  };
}

export const useComments = (postId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    const { data: commentsData, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      setLoading(false);
      return;
    }

    // Fetch profiles for comments
    const userIds = [...new Set(commentsData?.map((c) => c.user_id) || [])];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, username, avatar_url")
      .in("user_id", userIds);

    const profilesMap = new Map(profilesData?.map((p) => [p.user_id, p]) || []);

    const commentsWithProfiles = (commentsData || []).map((comment) => ({
      ...comment,
      profile: profilesMap.get(comment.user_id) || undefined,
    }));

    setComments(commentsWithProfiles);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `post_id=eq.${postId}` },
        () => fetchComments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user?.uid || !content.trim()) return { error: "Invalid input" };

    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: user.uid, content: content.trim() })
      .select()
      .single();

    return { data, error };
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    return { error };
  };

  return { comments, loading, addComment, deleteComment, commentsCount: comments.length };
};
