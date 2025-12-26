import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { toast } from "sonner";

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setLoading(true);
    const { error } = await createPost(imageFile, caption);
    setLoading(false);

    if (error) {
      toast.error("Ошибка при создании поста");
    } else {
      toast.success("Пост опубликован!");
      navigate("/feed");
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />

      <main className="container-main py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-card rounded-card shadow-card p-8">
            <h1 className="text-page-title mb-8">Новый пост</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Фото</Label>
                {imagePreview ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors shadow-card"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-hover transition-all cursor-pointer">
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <ImagePlus className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">Загрузить фото</p>
                        <p className="text-sm text-text-secondary mt-1">
                          Нажмите для выбора
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Подпись</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Добавьте подпись..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!imageFile || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Публикация...
                    </>
                  ) : (
                    "Опубликовать"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/feed")}
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

export default CreatePost;
