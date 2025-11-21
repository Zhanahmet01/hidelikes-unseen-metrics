import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Shield, Sparkles } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      {/* Hero Section */}
      <div className="container-main py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Share Without Pressure</span>
          </div>

          <h1 className="text-display mb-6 text-foreground">
            Post freely.
            <br />
            <span className="text-primary">Likes are hidden.</span>
          </h1>

          <p className="text-body-large text-text-secondary mb-12 max-w-2xl mx-auto">
            HideLikes is a social platform where you can share photos and thoughts authentically. 
            Views and likes are visible only to you — never to others.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="p-8 bg-card rounded-card shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-section-title mb-3">Hidden Likes</h3>
            <p className="text-text-secondary">
              Only you can see how many likes your posts receive. Share without the pressure of validation.
            </p>
          </div>

          <div className="p-8 bg-card rounded-card shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-section-title mb-3">Private Views</h3>
            <p className="text-text-secondary">
              View counts are your secret. Create content for yourself, not for numbers.
            </p>
          </div>

          <div className="p-8 bg-card rounded-card shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-section-title mb-3">Authentic Sharing</h3>
            <p className="text-text-secondary">
              Focus on genuine connections and meaningful content without metric anxiety.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-20">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">H</span>
              </div>
              <span className="font-semibold text-foreground">HideLikes</span>
            </div>
            <p className="text-text-muted text-sm">
              © 2024 HideLikes. Share without the pressure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
