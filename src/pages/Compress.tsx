import { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Archive, ArrowLeft, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/services/pdfApi";
import { useNavigate } from "react-router-dom";

const Compress = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  console.log("Button disabled state:", isProcessing || files.length === 0);
  console.log("Files:", files);
  console.log("isProcessing:", isProcessing);
  const handleCompress = async () => {
    console.log("=== HANDLE COMPRESS CALLED ===");
    console.log("Files at start of function:", files);
    console.log("Compression level:", compressionLevel);
    console.log("Compress button clicked!", { files, compressionLevel });
    alert("Compress function called!");
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select a file to compress",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Use the basic compress method that exists in your API
      const result = await pdfApi.compress(files[0], compressionLevel);
      
      // Download the compressed file
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      
      const originalName = files[0].name.split('.')[0];
      a.download = `compressed_${originalName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "File compressed successfully!",
      });
      
      setFiles([]);
    } catch (error: any) {
      console.error("Compression error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to compress file. Please try again.",
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
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
                <Archive className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Compress Files
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Reduce file size while maintaining quality. Choose your compression level.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <FileUpload
                onFilesSelected={setFiles}
                acceptedTypes={['.pdf']}
                maxFiles={1}
                title="Select PDF file to compress"
                description="Choose the PDF file you want to reduce in size"
              />

              <div className="space-y-2">
                <Label htmlFor="compression" className="text-foreground">
                  Compression Level
                </Label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select compression level" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="low">Low (Minimal compression, highest quality)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced compression and quality)</SelectItem>
                    <SelectItem value="high">High (Maximum compression, good quality)</SelectItem>
                  </SelectContent>
                </Select>
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
                      onClick={() => setFiles([])}
                      className="flex-1 glass-card"
                      disabled={isProcessing}
                    >
                      Clear File
                    </Button>
                    <Button 
                    onClick={() => {
                      console.log("INLINE CLICK HANDLER CALLED");
                      alert("Inline handler works!");
                    }}
                    className="flex-1 glow-effect"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Test Click
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
                  <Archive className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Smart Compression</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent algorithms optimize file size
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card floating-animation" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">PDF Support</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized for PDF compression
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card floating-animation" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowLeft className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Quality Control</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred compression level
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compress;
