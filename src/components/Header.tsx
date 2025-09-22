import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, User, LogOut } from "lucide-react";
import { LoginDialog } from "./auth/LoginDialog";
import { SignupDialog } from "./auth/SignupDialog";

export const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Add logout logic here
  };

  return (
    <>
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PDFTools</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors">
              All Tools
            </a>
            <a href="#compress" className="text-muted-foreground hover:text-foreground transition-colors">
              Compress PDF
            </a>
            <a href="#convert" className="text-muted-foreground hover:text-foreground transition-colors">
              Convert
            </a>
            <a href="#merge" className="text-muted-foreground hover:text-foreground transition-colors">
              Merge PDF
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => setShowLogin(true)}>
                  Login
                </Button>
                <Button onClick={() => setShowSignup(true)}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginDialog 
        open={showLogin} 
        onOpenChange={setShowLogin}
        onSuccess={() => setIsLoggedIn(true)}
      />
      <SignupDialog 
        open={showSignup} 
        onOpenChange={setShowSignup}
        onSuccess={() => setIsLoggedIn(true)}
      />
    </>
  );
};