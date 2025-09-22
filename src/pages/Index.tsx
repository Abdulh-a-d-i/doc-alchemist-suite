import { Header } from "@/components/Header";
import { ToolsGrid } from "@/components/ToolsGrid";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Zap, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <FileText className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Convert, compress, merge, and edit PDF files for free. Fast, secure, and easy to use. 
            No software installation required.
          </p>
          <Button size="lg" className="text-lg px-8 py-3">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              All PDF Tools in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive collection of PDF tools. Each tool is designed to be fast, 
              secure, and incredibly easy to use.
            </p>
          </div>
          
          <ToolsGrid />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-accent/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose PDFTools?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Process your PDF files in seconds. Our optimized algorithms ensure quick conversions 
                without compromising quality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Secure</h3>
              <p className="text-muted-foreground">
                Your files are processed securely and deleted automatically. We never store or share 
                your documents with third parties.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-muted-foreground">
                No technical skills required. Simply drag, drop, and download. Our intuitive interface 
                makes PDF editing effortless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold">PDFTools</h3>
              </div>
              <p className="text-muted-foreground">
                The complete PDF toolkit for all your document needs. Fast, secure, and free.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Convert</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">PDF to Word</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Word to PDF</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">HTML to PDF</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Notion to PDF</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Optimize</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Compress PDF</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Merge PDF</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Split PDF</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Special Tools</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Jira to Word</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Word to Jira</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 PDFTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;