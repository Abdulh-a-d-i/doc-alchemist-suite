import { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, ArrowLeft, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/services/pdfApi";
import { useNavigate } from "react-router-dom";

const Split = () => {
  // Set page title for SEO
  document.title = "Split PDF – Free Online PDF Splitter | Free Tools";
  
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("Button disabled state:", isProcessing || files.length === 0 || !pages.trim());
  console.log("Files:", files);
  console.log("isProcessing:", isProcessing);

  const validatePageRange = (pageRange: string): boolean => {
    // Simple validation for page ranges like "1-3,5,7-10"
    const pattern = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;
    return pattern.test(pageRange.replace(/\s/g, ''));
  };

  const handleSplit = async () => {
    console.log("=== HANDLE SPLIT CALLED ===");
    console.log("Files at start of function:", files);
    console.log("Pages:", pages);
    console.log("Split button clicked!", { files, pages });

    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select a PDF file to split",
        variant: "destructive",
      });
      return;
    }

    if (!pages.trim()) {
      toast({
        title: "Error",
        description: "Please specify pages to extract",
        variant: "destructive",
      });
      return;
    }

    if (!validatePageRange(pages.trim())) {
      toast({
        title: "Error", 
        description: "Invalid page range format. Use format like: 1-3, 5, 7-10",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Use the basic split method (assuming PDF-only, matching compress simplification)
      const result = await pdfApi.split(files[0], pages);
      
      // Download the split file
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      
      const originalName = files[0].name.split('.')[0];
      a.download = `${originalName}_pages_${pages.replace(/[,\s]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "PDF split successfully!",
      });
      
      setFiles([]);
      setPages("");
    } catch (error: any) {
      console.error("Split error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to split PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="glass-card"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass-card neon-border animate-slide-up">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
                <Scissors className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Free PDF Split Tool
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Extract specific pages from your PDF – fast, free, and easy to use.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <FileUpload
                onFilesSelected={setFiles}
                acceptedTypes={['.pdf']}
                maxFiles={1}
                title="Select PDF file to split"
                description="Choose the PDF file you want to extract pages from"
              />

              <div className="space-y-2">
                <Label htmlFor="pages" className="text-foreground">
                  Pages to Extract
                </Label>
                <Input
                  id="pages"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="e.g., 1-3, 5, 7-10"
                  className="glass-card"
                />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Use commas to separate individual pages or ranges. Examples:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                    <li>• Single page: 5</li>
                    <li>• Range: 1-3 (pages 1, 2, and 3)</li>
                    <li>• Multiple: 1-3, 5, 7-10</li>
                    <li>• Mixed: 1, 3-5, 8, 10-12</li>
                  </ul>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Selected: {files[0].name} ({(files[0].size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFiles([]);
                        setPages("");
                      }}
                      className="flex-1 glass-card"
                      disabled={isProcessing}
                    >
                      Clear
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation(); // Keep if needed, but test removing
                        // e.preventDefault(); // Remove this—unnecessary for type="button" and may interfere
                        console.log('Compress button clicked');
                        handleSplit();
                      }}
                      disabled={isProcessing || files.length === 0}
                      className="flex-1 glow-effect"
                      style={{ pointerEvents: 'auto', zIndex: 10, userSelect: 'none' }} // Override: ensure clickable, raise above overlays, prevent text select
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Split PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card floating-animation" style={{ animationDelay: '0s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Precise Control</h3>
                <p className="text-sm text-muted-foreground">
                  Extract exactly the pages you need
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card floating-animation" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">High Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Maintains original PDF quality
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card floating-animation" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowLeft className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Flexible Syntax</h3>
                <p className="text-sm text-muted-foreground">
                  Simple page range notation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Split;
