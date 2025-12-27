import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Trash2, Grid3X3, Heart, MessageCircle, Camera, User, MapPin, Link as LinkIcon } from "lucide-react";
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
      await supabase.from("profiles").delete().eq("user_id", user.uid);
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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const displayUsername = profile?.username || "Пользователь";
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUsername}`;

  // Calculate total likes (mock data for now)
  const totalLikes = posts.length * 12;

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />

      <main className="container-main py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header with Gradient */}
          <div className="relative overflow-hidden rounded-2xl bg-card shadow-lg mb-8 animate-fade-in">
            {/* Gradient Background */}
            <div 
              className="absolute inset-0 h-40 opacity-80"
              style={{ 
                background: 'linear-gradient(135deg, hsl(245 81% 64%), hsl(252 100% 66%), hsl(280 70% 60%))'
              }}
            />
            <div className="absolute inset-0 h-40 bg-gradient-to-b from-transparent to-card" />
            
            {/* Profile Content */}
            <div className="relative pt-20 pb-8 px-8">
              {/* Avatar */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity" />
                  <Avatar className="relative w-36 h-36 ring-4 ring-card shadow-xl">
                    <AvatarImage src={avatarUrl} alt={displayUsername} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <Link 
                      to="/profile/edit"
                      className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                    </Link>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      {displayUsername}
                    </h1>
                    {isOwnProfile && (
                      <div className="flex gap-2">
                        <Link to="/profile/edit">
                          <Button variant="outline" className="gap-2 rounded-full px-6 hover:bg-primary hover:text-primary-foreground transition-all">
                            <Settings className="w-4 h-4" />
                            Редактировать
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Это действие нельзя отменить. Все ваши посты и данные будут удалены навсегда.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-full">Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteAccount} className="rounded-full bg-destructive hover:bg-destructive/90">
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>

                  {profile?.bio && (
                    <p className="text-text-secondary max-w-md mb-4">{profile.bio}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8 mt-8 pt-6 border-t border-border">
                <StatCard icon={Grid3X3} value={posts.length} label="Постов" />
                <StatCard icon={Heart} value={totalLikes} label="Лайков" />
                <StatCard icon={MessageCircle} value={posts.length * 3} label="Комментариев" />
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Публикации</h2>
            </div>

            {posts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative group animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Link to={`/post/${post.id}`} className="block w-full h-full">
                      <img
                        src={post.image_url}
                        alt={`Post ${post.id}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-white">
                          <Heart className="w-5 h-5 fill-white" />
                          <span className="font-semibold">12</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <MessageCircle className="w-5 h-5 fill-white" />
                          <span className="font-semibold">3</span>
                        </div>
                      </div>
                    </Link>
                    {isOwnProfile && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeletePost(post.id);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-destructive/90 backdrop-blur text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Camera className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Пока нет публикаций</h3>
                <p className="text-text-secondary mb-6">Поделитесь своими моментами с миром</p>
                {isOwnProfile && (
                  <Link to="/create">
                    <Button className="rounded-full px-8 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                      <Camera className="w-4 h-4" />
                      Создать первый пост
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  value: number;
  label: string;
}

const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
  <div className="flex items-center gap-3 group cursor-default">
    <div className="w-11 h-11 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  </div>
);

export default Profile;
