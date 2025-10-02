import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

interface Task {
  summary: string;
  description: string;
  priority: string;
  assignee_email: string;
  labels: string;
  type: string;
}

interface TextToJiraFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TextToJiraFlow = ({ open, onOpenChange }: TextToJiraFlowProps) => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [state, setState] = useState("");
  const [filename, setFilename] = useState("");
  const [step, setStep] = useState<"input" | "tasks" | "result">("input");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projectType, setProjectType] = useState<"classic" | "service_desk">("classic");
  const [projectKey, setProjectKey] = useState("");
  const [serviceDeskId, setServiceDeskId] = useState("");
  const [requestTypeId, setRequestTypeId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleParse = async () => {
    if (!text && !url) {
      toast({
        title: "Input required",
        description: "Please provide text or URL",
        variant: "destructive",
      });
      return;
    }

    setIsParsing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/convert/text-to-jira`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, url }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse text");
      }

      const data = await response.json();
      setTasks(data.tasks || []);
      setState(data.state || "");
      setFilename(data.filename || "");
      setStep("tasks");
      toast({
        title: "Success",
        description: `Parsed ${data.tasks?.length || 0} tasks`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse text",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleAuthenticateJira = async () => {
    if (!state) return;

    const popup = window.open(
      `${API_BASE_URL}/login/jira?state=${state}`,
      "jira-auth",
      "width=600,height=700"
    );

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jira/status?state=${state}`);
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          clearInterval(pollInterval);
          popup?.close();
          toast({
            title: "Authenticated",
            description: "Successfully authenticated with Jira",
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(pollInterval);
      popup?.close();
    }, 300000); // 5 min timeout
  };

  const handleDownloadWord = () => {
    if (!filename) return;
    window.open(`${API_BASE_URL}/downloads/${filename}`, "_blank");
  };

  const handleCreateIssues = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/jira/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          project_type: projectType,
          project_key: projectType === "classic" ? projectKey : undefined,
          service_desk_id: projectType === "service_desk" ? serviceDeskId : undefined,
          request_type_id: projectType === "service_desk" ? requestTypeId : undefined,
          tasks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create issues");
      }

      const data = await response.json();
      setResults(data.results || []);
      setStep("result");
      toast({
        title: "Issues created",
        description: `Created ${data.results?.filter((r: any) => r.success).length || 0} issues`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create issues",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const updateTask = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const resetFlow = () => {
    setText("");
    setUrl("");
    setTasks([]);
    setState("");
    setFilename("");
    setStep("input");
    setIsAuthenticated(false);
    setProjectType("classic");
    setProjectKey("");
    setServiceDeskId("");
    setRequestTypeId("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Text → Jira (LLM)</DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-input">Paste text or transcript</Label>
              <Textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                rows={8}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="url-input">Or paste meeting URL</Label>
              <Input
                id="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleParse} disabled={isParsing}>
                {isParsing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Parse
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === "tasks" && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Summary</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee Email</TableHead>
                    <TableHead>Labels</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Input
                          value={task.summary}
                          onChange={(e) => updateTask(idx, "summary", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={task.description}
                          onChange={(e) => updateTask(idx, "description", e.target.value)}
                          rows={2}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={task.priority}
                          onChange={(e) => updateTask(idx, "priority", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={task.assignee_email}
                          onChange={(e) => updateTask(idx, "assignee_email", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={task.labels}
                          onChange={(e) => updateTask(idx, "labels", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={task.type}
                          onChange={(e) => updateTask(idx, "type", e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAuthenticateJira} disabled={isAuthenticated}>
                {isAuthenticated ? "✓ Authenticated" : "Authenticate Jira"}
              </Button>
              <Button variant="outline" onClick={handleDownloadWord}>
                Download Word
              </Button>
            </div>

            {isAuthenticated && (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label>Project Type</Label>
                    <Select value={projectType} onValueChange={(v) => setProjectType(v as any)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Classic Project</SelectItem>
                        <SelectItem value="service_desk">Service Desk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {projectType === "classic" && (
                    <div>
                      <Label htmlFor="project-key">Project Key</Label>
                      <Input
                        id="project-key"
                        value={projectKey}
                        onChange={(e) => setProjectKey(e.target.value)}
                        placeholder="e.g., PROJ"
                        className="mt-2"
                      />
                    </div>
                  )}

                  {projectType === "service_desk" && (
                    <>
                      <div>
                        <Label htmlFor="service-desk-id">Service Desk ID</Label>
                        <Input
                          id="service-desk-id"
                          value={serviceDeskId}
                          onChange={(e) => setServiceDeskId(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="request-type-id">Request Type ID</Label>
                        <Input
                          id="request-type-id"
                          value={requestTypeId}
                          onChange={(e) => setRequestTypeId(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </>
                  )}

                  <Button onClick={handleCreateIssues} disabled={isCreating} className="w-full">
                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Issues
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === "result" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Creation Results</h3>
            <div className="space-y-2">
              {results.map((result, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4 flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{result.summary || `Task ${idx + 1}`}</p>
                      {result.success && result.link && (
                        <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View issue
                        </a>
                      )}
                      {!result.success && result.error && (
                        <p className="text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={resetFlow} className="w-full">
              Start New Conversion
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
