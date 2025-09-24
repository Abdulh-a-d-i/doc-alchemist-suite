import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/services/pdfApi";
import { Loader2 } from "lucide-react";

interface JiraToWordFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JiraToWordFlow = ({ open, onOpenChange }: JiraToWordFlowProps) => {
  const [projects, setProjects] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [customJql, setCustomJql] = useState("");
  const [state] = useState(() => Math.random().toString(36).substr(2, 9));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'auth' | 'configure' | 'export'>('auth');
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

  const handleJiraAuth = async () => {
    setIsProcessing(true);
    try {
      await pdfApi.loginJira(state);
      setIsAuthenticated(true);
      const projectsData = await pdfApi.getJiraProjects(state);
      setProjects(projectsData);
      setStep('configure');
      toast({
        title: "Success",
        description: "Jira authentication successful",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Jira authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      let result: Blob;
      
      if (customJql.trim()) {
        // Export using custom JQL
        result = await pdfApi.jiraToWord(state, undefined, customJql);
      } else if (selectedProject) {
        // Export using project key
        result = await pdfApi.jiraToWord(state, selectedProject);
      } else {
        toast({
          title: "Error",
          description: "Please select a project or enter a JQL query",
          variant: "destructive",
        });
        return;
      }

      downloadFile(result, "jira_export.docx");
      toast({
        title: "Success",
        description: "Jira data exported to Word document",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export Jira data",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Jira to Word - Export Issues</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'auth' && (
            <div className="space-y-4 text-center">
              <div>
                <h3 className="text-lg font-semibold mb-2">Authenticate with Jira</h3>
                <p className="text-muted-foreground mb-4">
                  Click the button below to authenticate with Jira. A popup window will open for you to login.
                </p>
              </div>
              <Button onClick={handleJiraAuth} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Authenticate with Jira'
                )}
              </Button>
            </div>
          )}

          {step === 'configure' && projects && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configure Export</h3>
              
              <Tabs defaultValue="project" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="project">By Project</TabsTrigger>
                  <TabsTrigger value="jql">Custom JQL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="project" className="space-y-4">
                  {projects.software && projects.software.length > 0 && (
                    <div>
                      <Label>Jira Software Projects</Label>
                      <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.software.map((project: any) => (
                            <SelectItem key={project.key} value={project.key}>
                              {project.name} ({project.key})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {projects.jsm && projects.jsm.length > 0 && (
                    <div>
                      <Label>Jira Service Management</Label>
                      <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service desk" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.jsm.map((desk: any) => (
                            <SelectItem key={desk.projectKey} value={desk.projectKey}>
                              {desk.name} ({desk.projectKey})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="jql" className="space-y-4">
                  <div>
                    <Label htmlFor="jql">JQL Query</Label>
                    <Textarea
                      id="jql"
                      value={customJql}
                      onChange={(e) => setCustomJql(e.target.value)}
                      placeholder="e.g., project = DEMO AND status = Done AND created >= -30d"
                      rows={4}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Enter a custom JQL query to filter the issues you want to export.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={handleExport} 
                disabled={isProcessing || (!selectedProject && !customJql.trim())}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  'Export to Word'
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};