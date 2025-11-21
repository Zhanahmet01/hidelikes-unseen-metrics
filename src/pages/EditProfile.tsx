import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("johndoe");
  const [bio, setBio] = useState("Designer & photographer 📸 | Love minimalism ✨");
  const [avatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    navigate("/profile/me");
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />

      <main className="container-main py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-card rounded-card shadow-card p-8">
            <h1 className="text-page-title mb-8">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={avatar} alt={username} />
                    <AvatarFallback className="text-3xl">
                      {username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors shadow-button"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-text-secondary">Click to change avatar</p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile/me")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
