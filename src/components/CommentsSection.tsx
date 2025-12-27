import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2, User } from "lucide-react";
import { useComments, Comment } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { user } = useAuth();
  const { comments, loading, addComment, deleteComment } = useComments(postId);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    await addComment(newComment);
    setNewComment("");
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comments list */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            Комментариев пока нет
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwner={comment.user_id === user?.uid}
              onDelete={() => handleDelete(comment.id)}
            />
          ))
        )}
      </div>

      {/* Add comment form */}
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Добавить комментарий..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!newComment.trim() || submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Отправить"}
          </Button>
        </form>
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  isOwner: boolean;
  onDelete: () => void;
}

const CommentItem = ({ comment, isOwner, onDelete }: CommentItemProps) => {
  return (
    <div className="flex gap-3 group">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.profile?.avatar_url || undefined} />
        <AvatarFallback>
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {comment.profile?.username || "Пользователь"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
              locale: ru,
            })}
          </span>
        </div>
        <p className="text-sm text-foreground">{comment.content}</p>
      </div>

      {isOwner && (
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      )}
    </div>
  );
};
