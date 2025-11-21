import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const Post = () => {
  const { id } = useParams();

  // Mock data
  const post = {
    id: id,
    username: "johndoe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=1200&fit=crop",
    caption: "Beautiful sunset at the beach today 🌅",
    timestamp: "2 hours ago",
  };

  const comments = [
    {
      id: "1",
      username: "jane_smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      text: "Absolutely stunning! 😍",
      timestamp: "1 hour ago",
    },
    {
      id: "2",
      username: "alex_design",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      text: "Love the colors in this!",
      timestamp: "30 minutes ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />

      <main className="container-main py-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr,400px] gap-8">
          {/* Image */}
          <div className="bg-card rounded-card overflow-hidden shadow-card animate-fade-in">
            <img
              src={post.image}
              alt={post.caption}
              className="w-full h-auto"
            />
          </div>

          {/* Comments Section */}
          <div className="bg-card rounded-card shadow-card flex flex-col h-fit max-h-[800px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Post Header */}
            <div className="p-4 border-b border-border">
              <Link to={`/profile/${post.username}`} className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.avatar} alt={post.username} />
                  <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground hover:underline">{post.username}</p>
                  <p className="text-xs text-text-muted">{post.timestamp}</p>
                </div>
              </Link>
            </div>

            {/* Caption */}
            <div className="p-4 border-b border-border">
              <p className="text-sm">
                <Link to={`/profile/${post.username}`} className="font-medium hover:underline mr-2">
                  {post.username}
                </Link>
                <span className="text-text-secondary">{post.caption}</span>
              </p>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Link to={`/profile/${comment.username}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.avatar} alt={comment.username} />
                      <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <p className="text-sm">
                      <Link to={`/profile/${comment.username}`} className="font-medium hover:underline mr-2">
                        {comment.username}
                      </Link>
                      <span className="text-text-secondary">{comment.text}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-1">{comment.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions & Comment Input */}
            <div className="border-t border-border p-4 space-y-3">
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

              <div className="flex gap-2">
                <Input placeholder="Add a comment..." />
                <Button>Post</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Post;
