import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useLikes = (postId: string) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLikes();

    const channel = supabase
      .channel(`likes-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes", filter: `post_id=eq.${postId}` },
        () => fetchLikes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, user?.uid]);

  const fetchLikes = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId);

    if (!error && data) {
      setLikesCount(data.length);
      setIsLiked(data.some((like) => like.user_id === user?.uid));
    }
  };

  const toggleLike = async () => {
    if (!user?.uid || loading) return;

    setLoading(true);

    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.uid);
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: user.uid });
    }

    setLoading(false);
  };

  return { likesCount, isLiked, toggleLike, loading };
};
