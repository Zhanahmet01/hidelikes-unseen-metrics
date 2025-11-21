import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";

const Profile = () => {
  const { username } = useParams();
  const isOwnProfile = username === "me"; // Mock check

  // Mock user data
  const user = {
    username: isOwnProfile ? "johndoe" : username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${isOwnProfile ? "johndoe" : username}`,
    bio: "Designer & photographer 📸 | Love minimalism ✨",
    postsCount: 42,
    followersCount: 1234,
    followingCount: 567,
  };

  // Mock posts
  const posts = Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    image: `https://images.unsplash.com/photo-${1682687220000 + i * 1000}?w=400&h=400&fit=crop`,
  }));

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />

      <main className="container-main py-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Profile Header */}
          <div className="bg-card rounded-card shadow-card p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-3xl">
                  {user.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <h1 className="text-2xl font-semibold">{user.username}</h1>
                  {isOwnProfile ? (
                    <Link to="/profile/edit">
                      <Button variant="outline" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  ) : (
                    <Button>Follow</Button>
                  )}
                </div>

                <div className="flex gap-8 justify-center md:justify-start mb-4">
                  <div className="text-center">
                    <p className="font-semibold text-lg">{user.postsCount}</p>
                    <p className="text-text-secondary text-sm">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{user.followersCount}</p>
                    <p className="text-text-secondary text-sm">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{user.followingCount}</p>
                    <p className="text-text-secondary text-sm">Following</p>
                  </div>
                </div>

                <p className="text-text-secondary">{user.bio}</p>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="aspect-square bg-card rounded-lg overflow-hidden hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={post.image}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
