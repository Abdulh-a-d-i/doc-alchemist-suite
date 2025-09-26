import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "./FileUpload";
import { useToast } from "@/hooks/use-toast";
import { pdfApi } from "@/services/pdfApi";
import { Loader2, Edit2, ExternalLink } from "lucide-react";

interface Task {
  id: string;
  summary: string;
  description: string;
  priority: string;
  assignee: string;
}

interface JiraTask {
  summary: string;
  description: string;
  priority: string;
  assignee: string;
}

interface WordToJiraFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WordToJiraFlow = ({ open, onOpenChange }: WordToJiraFlowProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDesk, setSelectedDesk] = useState("");
  const [requestTypes, setRequestTypes] = useState<any[]>([]);
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [state] = useState(() => Math.random().toString(36).substr(2, 9));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdIssues, setCreatedIssues] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'parse' | 'auth' | 'configure' | 'create' | 'success'>('upload');
  const { toast } = useToast();

  const handleFileUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select a Word file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await pdfApi.parseWordToTasks(files[0]);
      const tasksWithIds = (result.tasks || []).map((task: JiraTask, index: number) => ({
        ...task,
        id: `task-${index + 1}`
      }));
      setTasks(tasksWithIds);
      setStep('parse');
      toast({
        title: "Success",
        description: "Word document parsed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse Word document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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

  const handleDeskChange = async (deskId: string) => {
    setSelectedDesk(deskId);
    if (deskId) {
      try {
        const types = await pdfApi.getJiraRequestTypes(state, deskId);
        setRequestTypes(types);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load request types",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateIssues = async () => {
  setIsProcessing(true);
  try {
    const result = await pdfApi.createJiraIssues({
      state,
      projectType: selectedProject ? "software" : "jsm",
      projectKey: selectedProject || undefined,
      serviceDeskId: selectedDesk || undefined,
      requestTypeId: selectedRequestType || undefined,
      tasks,
    });

    setCreatedIssues(result.created || []);
    setStep('success');
    toast({
      title: "Success",
      description: `Created ${result.created?.length || 0} Jira issues`,
    });
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to create Jira issues",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};

  const updateTask = (index: number, field: keyof Task, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto border-primary/30 bg-background/98 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground font-semibold">Word to Jira - Create Issues</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'upload' && (
            <div className="space-y-4">
              <FileUpload
                onFilesSelected={setFiles}
                acceptedTypes={['.doc', '.docx']}
                maxFiles={1}
                title="Select Word document"
                description="Upload the Word document to parse tasks from"
              />
              <Button onClick={handleFileUpload} disabled={isProcessing || files.length === 0} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  'Parse Tasks'
                )}
              </Button>
            </div>
          )}

          {step === 'parse' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Parsed Tasks ({tasks.length})</h3>
                <Button onClick={() => setStep('auth')} disabled={tasks.length === 0}>
                  Continue to Jira Auth
                </Button>
              </div>
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {tasks.map((task, index) => (
                  <Card key={index} className="border border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-foreground font-semibold">
                        <Edit2 className="h-4 w-4" />
                        Task {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor={`summary-${index}`} className="text-foreground font-medium">Summary</Label>
                        <Input
                          id={`summary-${index}`}
                          value={task.summary}
                          onChange={(e) => updateTask(index, 'summary', e.target.value)}
                          className="bg-background/50 border-border/50 focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`description-${index}`} className="text-foreground font-medium">Description</Label>
                        <Textarea
                          id={`description-${index}`}
                          value={task.description}
                          onChange={(e) => updateTask(index, 'description', e.target.value)}
                          rows={3}
                          className="bg-background/50 border-border/50 focus:border-primary text-foreground resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`priority-${index}`} className="text-foreground font-medium">Priority</Label>
                          <Select value={task.priority} onValueChange={(value) => updateTask(index, 'priority', value)}>
                            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Highest">Highest</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Lowest">Lowest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`assignee-${index}`} className="text-foreground font-medium">Assignee</Label>
                          <Input
                            id={`assignee-${index}`}
                            value={task.assignee}
                            onChange={(e) => updateTask(index, 'assignee', e.target.value)}
                            placeholder="username"
                            className="bg-background/50 border-border/50 focus:border-primary text-foreground"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
              <h3 className="text-lg font-semibold">Configure Jira Project</h3>
              
              {projects.software && projects.software.length > 0 && (
                <div>
                  <Label>Jira Software Projects</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Software project" />
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
                <div className="space-y-3">
                  <Label>Jira Service Management</Label>
                  <Select value={selectedDesk} onValueChange={handleDeskChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Service Desk" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.jsm.map((desk: any) => (
                        <SelectItem key={desk.id} value={desk.id}>
                          {desk.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {requestTypes.length > 0 && (
                    <Select value={selectedRequestType} onValueChange={setSelectedRequestType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((type: any) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              <Button 
                onClick={handleCreateIssues} 
                disabled={isProcessing || (!selectedProject && !selectedRequestType)}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Issues...
                  </>
                ) : (
                  'Create Issues'
                )}
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Success!</h3>
                <p className="text-muted-foreground mb-4">
                  Successfully created {createdIssues.length} Jira issues.
                </p>
              </div>
              <div className="space-y-2">
                {createdIssues.map((issueKey) => (
                  <div key={issueKey} className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://your-domain.atlassian.net/browse/${issueKey}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        {issueKey}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={() => onOpenChange(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
