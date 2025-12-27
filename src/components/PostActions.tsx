import { Heart, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLikes } from "@/hooks/useLikes";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: string;
  commentsCount: number;
  onCommentClick?: () => void;
}

export const PostActions = ({ postId, commentsCount, onCommentClick }: PostActionsProps) => {
  const { likesCount, isLiked, toggleLike, loading } = useLikes(postId);

  return (
    <div className="flex items-center gap-4 py-3">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
        onClick={toggleLike}
        disabled={loading}
      >
        <Heart
          className={cn(
            "w-6 h-6 transition-all",
            isLiked ? "fill-red-500 text-red-500" : "text-foreground"
          )}
        />
        <span className="text-sm font-medium">{likesCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
        onClick={onCommentClick}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="text-sm font-medium">{commentsCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
      >
        <Send className="w-6 h-6" />
      </Button>
    </div>
  );
};
