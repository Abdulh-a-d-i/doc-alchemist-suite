import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PdfToJiraFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PdfToJiraFlow = ({ open, onOpenChange }: PdfToJiraFlowProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'processing' | 'success'>('upload');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file",
        variant: "destructive"
      });
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStep('processing');

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      toast({
        title: "Success!",
        description: "PDF converted to Jira tickets successfully"
      });
    }, 2000);
  };

  const resetFlow = () => {
    setFile(null);
    setStep('upload');
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">PDF to Jira</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'upload' && (
            <>
              <Card className="border-2 border-dashed">
                <CardContent className="p-8 text-center">
                  <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <Label htmlFor="pdf-upload" className="cursor-pointer">
                      <span className="text-primary hover:underline">Choose a PDF file</span>
                    </Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {file && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleConvert}
                disabled={!file}
                className="w-full"
              >
                Convert to Jira Tickets
              </Button>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-lg font-medium">Converting PDF to Jira tickets...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium mb-4">Conversion Complete!</p>
              <p className="text-sm text-muted-foreground mb-6">
                Your PDF has been converted to Jira tickets
              </p>
              <Button onClick={resetFlow} className="w-full">
                Convert Another File
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
