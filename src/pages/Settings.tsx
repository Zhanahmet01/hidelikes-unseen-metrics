import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Shield, Bell, Globe } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Mock logout
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar />

      <main className="container-main py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-card rounded-card shadow-card p-8">
            <h1 className="text-page-title mb-8">Settings</h1>

            <div className="space-y-8">
              {/* Privacy Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-section-title">Privacy</h2>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label className="text-base">Private Account</Label>
                    <p className="text-sm text-text-secondary">Only followers can see your posts</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label className="text-base">Hide Activity Status</Label>
                    <p className="text-sm text-text-secondary">Don't show when you're active</p>
                  </div>
                  <Switch />
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground mb-4">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-section-title">Notifications</h2>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-text-secondary">Receive notifications on your device</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-text-secondary">Get updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              {/* Language */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="text-section-title">Language</h2>
                </div>

                <div className="flex items-center justify-between py-3">
                  <Label className="text-base">App Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Logout */}
              <div className="pt-4">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full gap-2"
                  size="lg"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
