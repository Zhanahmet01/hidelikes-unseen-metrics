import { Link } from "react-router-dom";
import { Home, PlusSquare, User, Search, Settings, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full h-18 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container-main h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/feed" className="flex items-center gap-2 hover-lift">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          <span className="font-semibold text-xl text-foreground">HideLikes</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink
            to="/feed"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-hover hover:text-foreground transition-all"
            activeClassName="bg-hover text-foreground font-medium"
          >
            <Home className="w-5 h-5" />
            <span>Feed</span>
          </NavLink>

          <NavLink
            to="/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-hover hover:text-foreground transition-all"
            activeClassName="bg-hover text-foreground font-medium"
          >
            <PlusSquare className="w-5 h-5" />
            <span>Create</span>
          </NavLink>

          <NavLink
            to="/chat"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-hover hover:text-foreground transition-all"
            activeClassName="bg-hover text-foreground font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
          </NavLink>

          <NavLink
            to="/profile/me"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-hover hover:text-foreground transition-all"
            activeClassName="bg-hover text-foreground font-medium"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="w-5 h-5" />
          </Button>

          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
