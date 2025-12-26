import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const Feed = () => {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-secondary">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />
      
      <main className="container-feed py-8 space-y-6">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={post.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PostCard
                id={post.id}
                username={post.profile?.username || "Unknown"}
                avatar={post.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
                image={post.image_url}
                caption={post.caption || ""}
                timestamp={formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ru,
                })}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-card">
            <p className="text-text-secondary">Пока нет постов</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;
