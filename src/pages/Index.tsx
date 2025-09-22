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
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-2xl flex items-center justify-center animate-glow-pulse shadow-2xl">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent leading-tight">
              Future of PDF Tools
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Experience next-generation PDF processing with AI-powered tools. 
              Convert, compress, merge, and transform your documents in seconds.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto my-8">
              <SearchBar />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-4 glow-effect group">
                <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                Start Processing
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 glass-card">
                <Sparkles className="h-5 w-5 mr-2" />
                View All Tools
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              All PDF Tools in One Place
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose from our comprehensive collection of AI-powered PDF tools. 
              Each tool is designed for maximum speed, security, and ease of use.
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
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology for the modern workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card neon-border floating-animation group hover:scale-105 transition-all duration-300" style={{ animationDelay: '0s' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow-pulse">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-optimized processing engines deliver results in milliseconds. 
                  Experience the future of document processing speed.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card neon-border floating-animation group hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow-pulse">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Military-Grade Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  End-to-end encryption with automatic file deletion. 
                  Your documents are processed securely and never stored.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card neon-border floating-animation group hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow-pulse">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Intuitive Design</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Streamlined interface powered by user research. 
                  Complex operations made simple with smart automation.
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