import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostActions } from "@/components/PostActions";
import { CommentsSection } from "@/components/CommentsSection";
import { useComments } from "@/hooks/useComments";

interface PostCardProps {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  timestamp: string;
  userId?: string;
}

export const PostCard = ({ id, username, avatar, image, caption, timestamp, userId }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { commentsCount } = useComments(id);

  return (
    <article className="bg-card rounded-card shadow-card overflow-hidden hover-lift">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Link to={userId ? `/profile/${userId}` : "#"} className="flex items-center gap-3 flex-1">
          <Avatar className="w-10 h-10">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground hover:underline">{username}</p>
            <p className="text-xs text-text-muted">{timestamp}</p>
          </div>
        </Link>
      </div>

      {/* Image */}
      <Link to={`/post/${id}`}>
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src={image}
            alt={caption}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4">
        <div className="flex items-center justify-between">
          <PostActions 
            postId={id} 
            commentsCount={commentsCount}
            onCommentClick={() => setShowComments(!showComments)}
          />
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Bookmark className="w-6 h-6" />
          </Button>
        </div>

        {/* Caption */}
        <div className="space-y-1 pb-3">
          <p className="text-sm">
            <Link to={userId ? `/profile/${userId}` : "#"} className="font-medium hover:underline mr-2">
              {username}
            </Link>
            <span className="text-text-secondary">{caption}</span>
          </p>
          {commentsCount > 0 && !showComments && (
            <button
              onClick={() => setShowComments(true)}
              className="text-sm text-text-muted hover:text-text-secondary"
            >
              Показать все комментарии ({commentsCount})
            </button>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pb-4 border-t border-border pt-4">
            <CommentsSection postId={id} />
          </div>
        )}
      </div>
    </article>
  );
};
