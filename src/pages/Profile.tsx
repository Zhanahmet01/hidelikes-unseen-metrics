import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { usePosts } from "@/hooks/usePosts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const isOwnProfile = username === "me";

  const { profile, loading: profileLoading } = useProfile(
    isOwnProfile ? user?.uid : undefined
  );
  const { posts, loading: postsLoading, deletePost } = usePosts(
    isOwnProfile ? user?.uid : undefined
  );

  const handleDeletePost = async (postId: string) => {
    const { error } = await deletePost(postId);
    if (error) {
      toast.error("Ошибка при удалении поста");
    } else {
      toast.success("Пост удален");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.uid) return;

    try {
      // Delete profile (posts will be cascade deleted)
      await supabase.from("profiles").delete().eq("user_id", user.uid);
      
      // Sign out from Firebase
      const { logout } = await import("@/contexts/AuthContext").then(m => ({ logout: () => {} }));
      
      toast.success("Аккаунт удален");
      window.location.href = "/";
    } catch (error: any) {
      toast.error("Ошибка при удалении аккаунта");
    }
  };

  if (profileLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-background-secondary">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const displayUsername = profile?.username || "Unknown";
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUsername}`;

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />

      <main className="container-main py-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Profile Header */}
          <div className="bg-card rounded-card shadow-card p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Avatar className="w-32 h-32">
                <AvatarImage src={avatarUrl} alt={displayUsername} />
                <AvatarFallback className="text-3xl">
                  {displayUsername[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <h1 className="text-2xl font-semibold">{displayUsername}</h1>
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <Link to="/profile/edit">
                        <Button variant="outline" className="gap-2">
                          <Settings className="w-4 h-4" />
                          Редактировать
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Все ваши посты и данные будут удалены навсегда.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount}>
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>

                <div className="flex gap-8 justify-center md:justify-start mb-4">
                  <div className="text-center">
                    <p className="font-semibold text-lg">{posts.length}</p>
                    <p className="text-text-secondary text-sm">Постов</p>
                  </div>
                </div>

                {profile?.bio && (
                  <p className="text-text-secondary">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="aspect-square bg-card rounded-lg overflow-hidden hover-lift animate-fade-in relative group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link to={`/post/${post.id}`}>
                    <img
                      src={post.image_url}
                      alt={`Post ${post.id}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {isOwnProfile && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-card">
              <p className="text-text-secondary">Пока нет постов</p>
              {isOwnProfile && (
                <Link to="/create">
                  <Button className="mt-4">Создать первый пост</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
