import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "./FileUpload";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/services/pdfApi";
import { Loader2 } from "lucide-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  type: 'convert' | 'compress' | 'merge' | 'split' | 'jira-to-word' | 'word-to-jira' | 'pdf-to-notion' | 'html-to-pdf' | 'pdf-to-jira' | 'jira-to-pdf' | 'notion-to-pdf' | 'text-to-jira';
}

interface ConversionModalProps {
  tool: Tool;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConversionModal = ({ tool, open, onOpenChange }: ConversionModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [url, setUrl] = useState("");
  const [pages, setPages] = useState("");
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [projectKey, setProjectKey] = useState("");
  const [jql, setJql] = useState("");
  const { toast } = useToast();

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleProcess = async () => {
    setIsProcessing(true);

    try {
      let result: Blob | any;
      
      switch (tool.type) {
        case 'convert':
          if (files.length === 0) {
            toast({
              title: "Error",
              description: "Please select files to convert",
              variant: "destructive",
            });
            return;
          }
        
          let target = '';
          if (tool.id === 'pdf-to-word') target = 'docx';
          else if (tool.id === 'word-to-pdf') target = 'pdf';
          else if (tool.id === 'pdf-to-jpg') target = 'jpg';
          else if (tool.id === 'jpg-to-pdf') target = 'pdf';
        
          const { blob, fileName } = await pdfApi.convert(files[0], target);
        
          downloadFile(blob, fileName); // ✅ now passing a real Blob + filename
          break;
          
        case 'compress':
          if (files.length === 0) {
            toast({
              title: "Error", 
              description: "Please select files to compress",
              variant: "destructive",
            });
            return;
          }
          result = await pdfApi.compress(files[0], compressionLevel);
          downloadFile(result, `compressed_${files[0].name}`);
          break;
          
        case 'merge':
          if (files.length < 2) {
            toast({
              title: "Error",
              description: "Please select at least 2 files to merge",
              variant: "destructive",
            });
            return;
          }
          result = await pdfApi.merge(files);
          downloadFile(result, "merged.pdf");
          break;
          
        case 'split':
          if (files.length === 0 || !pages) {
            toast({
              title: "Error",
              description: "Please select a file and specify pages to split",
              variant: "destructive",
            });
            return;
          }
          result = await pdfApi.split(files[0], pages);
          downloadFile(result, `split_${files[0].name}`);
          break;
          
        case 'html-to-pdf':
          if (!textContent && !url) {
            toast({
              title: "Error",
              description: "Please provide HTML content or URL",
              variant: "destructive",
            });
            return;
          }
          result = await pdfApi.htmlToPdf(textContent, url);
          downloadFile(result, "converted.pdf");
          break;
          
        case 'jira-to-word':
          // This case is now handled by JiraToWordFlow component
          toast({
            title: "Info",
            description: "This feature has been moved to a dedicated flow",
          });
          break;
          
        case 'word-to-jira':
          // This case is now handled by WordToJiraFlow component
          toast({
            title: "Info", 
            description: "This feature has been moved to a dedicated flow",
          });
          break;
          
        case 'pdf-to-notion':
          if (files.length === 0) {
            toast({
              title: "Error",
              description: "Please select a PDF file",
              variant: "destructive",
            });
            return;
          }
          result = await pdfApi.pdfToNotion(files[0]);
          navigator.clipboard.writeText(result.content || JSON.stringify(result));
          toast({
            title: "Success",
            description: "Notion content copied to clipboard",
          });
          break;
          
        case 'pdf-to-jira':
          if (files.length === 0) {
            toast({
              title: "Error",
              description: "Please select a PDF file",
              variant: "destructive",
            });
            return;
          }
          result = await pdfApi.pdfToNotion(files[0]); // Placeholder - will be updated when API is ready
          toast({
            title: "Success",
            description: "PDF converted to Jira format successfully",
          });
          break;
          
        case 'jira-to-pdf':
          result = await pdfApi.htmlToPdf("Jira content converted to PDF"); // Placeholder
          downloadFile(result, "jira-export.pdf");
          break;
          
        case 'notion-to-pdf':
          if (files.length === 0) {
            toast({
              title: "Error",
              description: "Please select a Notion export file",
              variant: "destructive",
            });
            return;
          }
          result = await pdfApi.htmlToPdf("Notion content converted to PDF"); // Placeholder
          downloadFile(result, "notion-export.pdf");
          break;
      }

      if (!['word-to-jira', 'pdf-to-notion'].includes(tool.type)) {
        toast({
          title: "Success",
          description: "File processed successfully!",
        });
      }
      
      onOpenChange(false);
      
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAcceptedTypes = () => {
    switch (tool.type) {
      case 'convert':
        if (tool.id.includes('pdf-to')) return ['.pdf'];
        if (tool.id.includes('word-to')) return ['.doc', '.docx'];
        if (tool.id.includes('jpg-to')) return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
        return ['.pdf'];
      case 'word-to-jira':
        return ['.doc', '.docx'];
      case 'pdf-to-notion':
        return ['.pdf'];
      case 'pdf-to-jira':
        return ['.pdf'];
      case 'jira-to-pdf':
        return ['.json', '.txt'];
      case 'notion-to-pdf':
        return ['.zip', '.html', '.md'];
      default:
        return ['.pdf'];
    }
  };

  const getMaxFiles = () => {
    return tool.type === 'merge' ? 10 : 1;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-primary/30 bg-background/98 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground font-semibold">{tool.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {(tool.type === 'html-to-pdf') ? (
            <Tabs defaultValue="url">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">From URL</TabsTrigger>
                <TabsTrigger value="html">HTML Content</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </TabsContent>
              <TabsContent value="html" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="html">HTML Content</Label>
                  <Textarea
                    id="html"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste your HTML content here..."
                    rows={8}
                  />
                </div>
              </TabsContent>
            </Tabs>
          ) : (tool.type === 'jira-to-word' || tool.type === 'word-to-jira') ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectKey">Project Key</Label>
                <Input
                  id="projectKey"
                  value={projectKey}
                  onChange={(e) => setProjectKey(e.target.value)}
                  placeholder="e.g., PROJ"
                />
              </div>
              {tool.type === 'jira-to-word' && (
                <div className="space-y-2">
                  <Label htmlFor="jql">JQL Query (Optional)</Label>
                  <Input
                    id="jql"
                    value={jql}
                    onChange={(e) => setJql(e.target.value)}
                    placeholder="e.g., project = PROJ AND status = Done"
                  />
                </div>
              )}
              {tool.type === 'word-to-jira' && (
                <FileUpload
                  onFilesSelected={setFiles}
                  acceptedTypes={getAcceptedTypes()}
                  maxFiles={getMaxFiles()}
                  title="Select Word file"
                  description="Upload the Word document to convert to Jira format"
                />
              )}
            </div>
          ) : (tool.type === 'pdf-to-notion') ? (
            <FileUpload
              onFilesSelected={setFiles}
              acceptedTypes={getAcceptedTypes()}
              maxFiles={getMaxFiles()}
              title="Select PDF file"
              description="Upload the PDF to convert to Notion format"
            />
          ) : (
            <>
              <FileUpload
                onFilesSelected={setFiles}
                acceptedTypes={getAcceptedTypes()}
                maxFiles={getMaxFiles()}
                title={`Select ${tool.title.split(' ')[0]} files`}
                description={tool.description}
              />
              
              {tool.type === 'compress' && (
                <div className="space-y-2">
                  <Label htmlFor="compression">Compression Level</Label>
                  <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compression level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {tool.type === 'split' && (
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages to Extract</Label>
                  <Input
                    id="pages"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="e.g., 1-3, 5, 7-10"
                  />
                </div>
              )}
            </>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleProcess} disabled={isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Process ${tool.title}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
