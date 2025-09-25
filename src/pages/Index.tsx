import { Header } from "@/components/Header";
import { ToolsGrid } from "@/components/ToolsGrid";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, Zap, Users, Sparkles, Rocket } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/8 via-background to-accent/8"></div>
          <div className="absolute top-32 left-16 w-80 h-80 bg-gradient-to-r from-primary/15 to-transparent rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-32 right-16 w-96 h-96 bg-gradient-to-l from-accent/15 to-transparent rounded-full blur-3xl floating-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-2xl floating" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          {/* Logo Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-primary via-purple-500 to-accent rounded-3xl flex items-center justify-center hover-glow shadow-2xl transition-all duration-700 hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                <FileText className="h-14 w-14 text-white relative z-10 drop-shadow-2xl" />
              </div>
              {/* Orbital rings */}
              <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-rotate-slow"></div>
              <div className="absolute inset-2 border border-accent/20 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse' }}></div>
            </div>
          </div>
          
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-heading font-bold gradient-text leading-none tracking-tight">
                REVOLUTIONARY FREE
                <br />
                <span className="text-glow">AI-POWERED PDF SUITE</span>
              </h1>
              <div className="flex justify-center">
                <div className="h-1 w-32 bg-gradient-to-r from-primary via-accent to-primary rounded-full glow-primary"></div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              Experience next-generation FREE PDF processing with{" "}
              <span className="text-primary font-medium">AI-powered intelligence</span>. 
              FREE converters to compress, merge, and transform your documents with{" "}
              <span className="text-accent font-medium">unprecedented speed</span> - all completely FREE.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-xl mx-auto my-12">
              <div className="relative glass-card p-2 rounded-2xl neon-border">
                <SearchBar />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary"></div>
              <span className="text-sm font-mono tracking-wider text-primary uppercase">
                ULTIMATE FREE TOOLKIT
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 gradient-text">
              All FREE PDF Tools in One Place
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose from our comprehensive collection of{" "}
              <span className="text-primary font-medium">FREE AI-powered PDF tools</span>. 
              Each FREE converter is designed for maximum speed, security, and ease of use.
            </p>
          </div>
          
          <ToolsGrid />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose Our FREE Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology for modern workflow - completely FREE
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card neon-border hover-lift group relative overflow-hidden" style={{ animationDelay: '0s' }}>
              <CardContent className="p-8 text-center relative z-10">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-primary/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 border border-accent/20 rounded-full"></div>
                </div>
                
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <Zap className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 text-foreground">Lightning Fast & FREE</h3>
                <p className="text-muted-foreground leading-relaxed">
                  FREE AI-optimized processing engines deliver results in{" "}
                  <span className="text-yellow-400 font-medium">milliseconds</span>. 
                  Experience the future of FREE document processing speed.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card neon-border hover-lift group relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8 text-center relative z-10">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 left-4 w-28 h-28 border border-green-400/20 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-36 h-36 border border-blue-400/20 rounded-full"></div>
                </div>
                
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <Shield className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 text-foreground">Military-Grade Security & FREE</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="text-green-400 font-medium">FREE End-to-end encryption</span> with automatic file deletion. 
                  Your documents are processed securely and never stored - all FREE.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card neon-border hover-lift group relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-8 text-center relative z-10">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-purple-400/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-28 h-28 border border-pink-400/20 rounded-full"></div>
                </div>
                
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <Users className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 text-foreground">Intuitive Design & FREE</h3>
                <p className="text-muted-foreground leading-relaxed">
                  FREE streamlined interface powered by{" "}
                  <span className="text-purple-400 font-medium">user research</span>. 
                  Complex operations made simple with FREE smart automation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-primary">1M+</h3>
              <p className="text-muted-foreground">Documents Processed</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-primary">99.9%</h3>
              <p className="text-muted-foreground">Uptime</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-primary">50+</h3>
              <p className="text-muted-foreground">Countries</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-primary">24/7</h3>
              <p className="text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-primary/20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  PDFTools
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The next-generation PDF toolkit powered by AI. 
                Transform your document workflow with intelligent automation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Convert</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">PDF to Word</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Word to PDF</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">HTML to PDF</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Notion to PDF</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Optimize</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/compress" className="text-muted-foreground hover:text-primary transition-colors">Compress PDF</a></li>
                <li><a href="/merge" className="text-muted-foreground hover:text-primary transition-colors">Merge PDF</a></li>
                <li><a href="/split" className="text-muted-foreground hover:text-primary transition-colors">Split PDF</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Special Tools</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Jira to Word</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Word to Jira</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary/20 pt-8 mt-12 text-center">
            <p className="text-muted-foreground">
              &copy; 2024 PDFTools. Engineered for the future. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;