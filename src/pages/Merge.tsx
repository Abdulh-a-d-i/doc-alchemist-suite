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

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 PDF files to merge",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await pdfApi.merge(files);
      
      // Download the merged file
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "PDFs merged successfully!",
      });
      
      setFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge PDFs. Please try again.",
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
                Combine multiple PDF files into a single document. Drag and drop your files or click to browse.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <FileUpload
                onFilesSelected={setFiles}
                acceptedTypes={['.pdf']}
                maxFiles={10}
                title="Select PDF files to merge"
                description="Choose 2 or more PDF files to combine into one document"
              />

              {files.length > 0 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {files.length} file{files.length !== 1 ? 's' : ''} selected
                    </p>
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
                      onClick={handleMerge}
                      disabled={isProcessing || files.length < 2}
                      className="flex-1 glow-effect"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Merging...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Merge PDFs
                        </>
                      )}
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
                <h3 className="font-semibold mb-2">Multiple Files</h3>
                <p className="text-sm text-muted-foreground">
                  Merge up to 10 PDF files at once
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card floating-animation" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Fast Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Quick and efficient PDF merging
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card floating-animation" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowLeft className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Maintain Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Original quality preserved
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