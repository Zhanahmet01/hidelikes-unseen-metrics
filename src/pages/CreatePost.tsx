import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock post creation
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />

      <main className="container-main py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-card rounded-card shadow-card p-8">
            <h1 className="text-page-title mb-8">Create New Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Photo</Label>
                {imagePreview ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
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
                        <p className="font-medium text-foreground">Upload a photo</p>
                        <p className="text-sm text-text-secondary mt-1">
                          Click to browse or drag and drop
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
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!imagePreview}
                >
                  Share Post
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/feed")}
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

export default CreatePost;
