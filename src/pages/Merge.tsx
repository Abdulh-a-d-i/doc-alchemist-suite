import { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitMerge, ArrowLeft, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/services/pdfApi";
import { useNavigate } from "react-router-dom";

const Merge = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("Button disabled state:", isProcessing || files.length < 2);
  console.log("Files:", files);
  console.log("isProcessing:", isProcessing);

  const handleMerge = async () => {
    console.log("=== HANDLE MERGE CALLED ===");
    console.log("Files at start of function:", files);
    console.log("Merge button clicked!", { files });
    alert("Merge function called!");

    if (files.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 files to merge",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Use the basic merge method (assuming PDF-only, matching compress simplification)
      const result = await pdfApi.merge(files);
      
      // Download the merged file
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Files merged successfully!",
      });
      
      setFiles([]);
    } catch (error: any) {
      console.error("Merge error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to merge files. Please try again.",
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
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
                <GitMerge className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Merge PDF Files
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Combine multiple PDF files into a single document.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <FileUpload
                onFilesSelected={setFiles}
                acceptedTypes={['.pdf']}
                maxFiles={10} // Adjusted for PDF merge
                title="Select PDF files to merge"
                description="Choose 2 or more PDF files to combine into one document"
              />

              {files.length > 0 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {files.length} file{files.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="mt-2 space-y-1">
                      {files.map((file, index) => (
                        <p key={index} className="text-xs text-muted-foreground">
                          {index + 1}. {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setFiles([])}
                      className="flex-1 glass-card"
                      disabled={isProcessing}
                    >
                      Clear Files
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation(); // Keep if needed, but test removing
                        // e.preventDefault(); // Remove this—unnecessary for type="button" and may interfere
                        console.log('Compress button clicked');
                        handleMerge();
                      }}
                      disabled={isProcessing || files.length === 0}
                      className="flex-1 glow-effect"
                      style={{ pointerEvents: 'auto', zIndex: 10, userSelect: 'none' }} // Override: ensure clickable, raise above overlays, prevent text select
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Merge Files
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
                  <GitMerge className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">PDF Merge</h3>
                <p className="text-sm text-muted-foreground">
                  Seamless PDF combination
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card floating-animation" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Batch Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Combine up to 10 files at once
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card floating-animation" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowLeft className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Smart Order</h3>
                <p className="text-sm text-muted-foreground">
                  Files merged in upload order
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merge;
