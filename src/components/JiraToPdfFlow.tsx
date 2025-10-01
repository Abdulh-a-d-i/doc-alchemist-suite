import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JiraToPdfFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JiraToPdfFlow = ({ open, onOpenChange }: JiraToPdfFlowProps) => {
  const [projectKey, setProjectKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!projectKey.trim()) {
      toast({
        title: "Project key required",
        description: "Please enter a Jira project key",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      toast({
        title: "Success!",
        description: "Jira tickets exported to PDF successfully"
      });
    }, 2000);
  };

  const resetFlow = () => {
    setProjectKey("");
    setStep('input');
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Jira to PDF</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'input' && (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-key">Jira Project Key</Label>
                      <Input
                        id="project-key"
                        placeholder="e.g., PROJ-123"
                        value={projectKey}
                        onChange={(e) => setProjectKey(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter the project key or ticket IDs you want to export
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleConvert}
                disabled={!projectKey.trim()}
                className="w-full"
              >
                Export to PDF
              </Button>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-lg font-medium">Exporting Jira tickets to PDF...</p>
              <p className="text-sm text-muted-foreground mt-2">Fetching and formatting data</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium mb-4">Export Complete!</p>
              <p className="text-sm text-muted-foreground mb-6">
                Your Jira tickets have been exported to PDF
              </p>
              <div className="space-y-3">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={resetFlow} variant="outline" className="w-full">
                  Export Another Project
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
