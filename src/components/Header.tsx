import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, User, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const navItems = [
    { label: "All Tools", href: "/", id: "tools" },
    { label: "Jira Conversions", href: "/jira-conversions", id: "jira" },
    { label: "Compress PDF", href: "/compress", id: "compress" },
    { label: "Merge PDF", href: "/merge", id: "merge" },
    { label: "Split PDF", href: "/split", id: "split" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-surface border-b border-primary/20 backdrop-blur-3xl">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="relative w-12 h-12 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center group-hover:scale-110 hover-glow transition-all duration-500 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
            <FileText className="h-7 w-7 text-white relative z-10 drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold gradient-text">
              FREE PDFTools
            </h1>
            <p className="text-xs text-muted-foreground font-mono tracking-wider">
              SUITE
            </p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.href)}
              className="relative text-muted-foreground hover:text-primary transition-all duration-300 group font-medium"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 rounded-full"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 glass-card px-3 py-2 rounded-lg">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-primary/20">
                    {getUserInitials(user.email || '')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm hidden md:inline">{user.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="glass-card hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent/80 border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25 hidden md:inline-flex font-medium"
              >
                Sign In
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden glass-card"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-primary/20 animate-slide-up">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.href);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-border/20 pt-4 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary/20">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full glass-card"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full glow-effect"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};