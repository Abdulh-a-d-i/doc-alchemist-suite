import { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GitMerge, ArrowLeft, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/services/pdfApi";
import { useNavigate } from "react-router-dom";

const Merge = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [mergeType, setMergeType] = useState("pdf");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMerge = async () => {
    console.log("Merge button clicked!", { files, mergeType }); // Debug log
    
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
      // Use the basic merge method that exists in your API
      const result = await pdfApi.merge(files);
      
      // Download the merged file
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
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
      console.error("Merge error:", error); // Debug log
      toast({
        title: "Error",
        description: error.message || "Failed to merge files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAcceptedTypes = () => {
    switch (mergeType) {
      case 'pdf':
        return ['.pdf'];
      case 'word':
        return ['.docx', '.doc'];
      case 'powerpoint':
        return ['.pptx', '.ppt'];
      case 'excel':
        return ['.xlsx', '.xls'];
      case 'images':
        return ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
      default:
        return ['.pdf'];
    }
  };

  const getMaxFiles = () => {
    switch (mergeType) {
      case 'images':
        return 20;
      default:
        return 10;
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
                Merge Files
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Combine multiple files into a single document. Choose your file type and upload your files.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="merge-type" className="text-foreground">
                  File Type to Merge
                </Label>
                <Select value={mergeType} onValueChange={(value) => {
                  setMergeType(value);
                  setFiles([]);
                }}>
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="pdf">PDF Files</SelectItem>
                    <SelectItem value="word">Word Documents</SelectItem>
                    <SelectItem value="powerpoint">PowerPoint Presentations</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheets</SelectItem>
                    <SelectItem value="images">Images (to PDF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FileUpload
                onFilesSelected={setFiles}
                acceptedTypes={getAcceptedTypes()}
                maxFiles={getMaxFiles()}
                title={`Select ${mergeType.toUpperCase()} files to merge`}
                description={`Choose 2 or more ${mergeType.toUpperCase()} files to combine into one document`}
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
                          Merge Files
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Merge;
