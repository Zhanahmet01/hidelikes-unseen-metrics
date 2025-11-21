import { Link } from "react-router-dom";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  timestamp: string;
}

export const PostCard = ({ id, username, avatar, image, caption, timestamp }: PostCardProps) => {
  return (
    <article className="bg-card rounded-card shadow-card overflow-hidden hover-lift">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Link to={`/profile/${username}`} className="flex items-center gap-3 flex-1">
          <Avatar className="w-10 h-10">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
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
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Heart className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Bookmark className="w-6 h-6" />
          </Button>
        </div>

        {/* Caption */}
        <div className="space-y-1">
          <p className="text-sm">
            <Link to={`/profile/${username}`} className="font-medium hover:underline mr-2">
              {username}
            </Link>
            <span className="text-text-secondary">{caption}</span>
          </p>
          <Link
            to={`/post/${id}`}
            className="text-sm text-text-muted hover:text-text-secondary"
          >
            View all comments
          </Link>
        </div>
      </div>
    </article>
  );
};
