import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";

// Mock data
const posts = [
  {
    id: "1",
    username: "johndoe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop",
    caption: "Beautiful sunset at the beach today 🌅",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    username: "jane_smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    image: "https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800&h=800&fit=crop",
    caption: "Coffee and code ☕️💻",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    username: "alex_design",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    image: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&h=800&fit=crop",
    caption: "New design exploration for a mobile app",
    timestamp: "1 day ago",
  },
];

const Feed = () => {
  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />
      
      <main className="container-feed py-8 space-y-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PostCard {...post} />
          </div>
        ))}
      </main>
    </div>
  );
};

export default Feed;
