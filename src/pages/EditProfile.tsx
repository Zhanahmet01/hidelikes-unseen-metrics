import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const EditProfile = () => {
  const navigate = useNavigate();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`);
    }
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { error } = await uploadAvatar(file);
    setUploading(false);

    if (error) {
      toast.error("Ошибка при загрузке аватара");
    } else {
      toast.success("Аватар обновлен");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await updateProfile({
      username: username.trim(),
      bio: bio.trim() || null,
    });

    setSaving(false);

    if (error) {
      toast.error("Ошибка при сохранении");
    } else {
      toast.success("Профиль обновлен");
      navigate("/profile/me");
    }
  };

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

      <main className="container-main py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-card rounded-card shadow-card p-8">
            <h1 className="text-page-title mb-8">Редактировать профиль</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile?.avatar_url || avatarUrl} alt={username} />
                    <AvatarFallback className="text-3xl">
                      {username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors shadow-button cursor-pointer">
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="text-sm text-text-secondary">Нажмите чтобы изменить аватар</p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ваше имя"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">О себе</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Расскажите о себе"
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Сохранить"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile/me")}
                  className="flex-1"
                >
                  Отмена
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
