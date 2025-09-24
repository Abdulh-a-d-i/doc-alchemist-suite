// PDF conversion and processing API service with backend integration

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://full-shrimp-deeply.ngrok-free.app";

class PdfAPI {
  private sessionId: string | null = null;

  // 🔑 central helper to inject headers into every fetch
  private async request(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "ngrok-skip-browser-warning": "true", // bypass ngrok banner
        "Accept": "application/json, text/plain, */*",
      },
    });

    return response;
  }

  // Convert files using the /convert endpoint
  async convert(file: File, target: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);

    const response = await this.request(`${API_BASE_URL}/convert`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Conversion failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Convert URL to PDF
  async convertUrl(url: string, target: string) {
    const formData = new FormData();
    formData.append("url", url);
    formData.append("target", target);

    const response = await this.request(`${API_BASE_URL}/convert-url`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`URL conversion failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Compress PDF files
  async compress(file: File, level: string = "medium") {
    const formData = new FormData();
    formData.append("compress_type", "pdf");
    formData.append("file", file);
    formData.append("level", level);

    const response = await this.request(`${API_BASE_URL}/compress`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Compression failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Merge multiple PDF files
  async merge(files: File[]) {
    const formData = new FormData();
    formData.append("merge_type", "pdf");
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await this.request(`${API_BASE_URL}/merge`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Merge failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Jira authentication with state
  async loginJira(state: string): Promise<void> {
    const url = `${API_BASE_URL}/login/jira?state=${state}`;
    const popup = window.open(url, "jira-auth", "width=600,height=700");

    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          this.checkJiraStatus(state).then(resolve).catch(reject);
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        if (event.data === "jira_auth_success") {
          clearInterval(checkClosed);
          popup?.close();
          window.removeEventListener("message", messageHandler);
          resolve();
        }
      };
      window.addEventListener("message", messageHandler);

      setTimeout(() => {
        clearInterval(checkClosed);
        popup?.close();
        window.removeEventListener("message", messageHandler);
        reject(new Error("Authentication timeout"));
      }, 300000);
    });
  }

  // Check Jira authentication status
  async checkJiraStatus(state: string): Promise<void> {
    const response = await this.request(
      `${API_BASE_URL}/jira/status?state=${state}`
    );
    const data = await response.json();

    if (!data.authenticated) {
      throw new Error("Jira authentication failed");
    }
  }

  // Get Jira projects
  async getJiraProjects(state: string) {
    const response = await this.request(
      `${API_BASE_URL}/jira/projects?state=${state}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    return response.json();
  }

  // Get Jira request types for Service Desk
  async getJiraRequestTypes(state: string, serviceDeskId: string) {
    const response = await this.request(
      `${API_BASE_URL}/jira/request-types?state=${state}&service_desk_id=${serviceDeskId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch request types: ${response.statusText}`);
    }
    return response.json();
  }

  // Create Jira issues
  async createJiraIssues(
  state: string,
  projectType: "software" | "jsm",
  tasks: any[],
  projectKey?: string,
  serviceDeskId?: string,
  requestTypeId?: string
) {
  try {
    let payload: any = { state, project_type: projectType, tasks };

    if (projectType === "software") {
      if (!projectKey) {
        throw new Error("projectKey is required for software projects");
      }
      payload.project_key = projectKey;
    }

    if (projectType === "jsm") {
      if (!serviceDeskId || !requestTypeId) {
        throw new Error("serviceDeskId and requestTypeId are required for JSM projects");
      }
      payload.service_desk_id = serviceDeskId;
      payload.request_type_id = requestTypeId;
    }

    console.log("🚀 Sending payload to backend:", payload);

    const res = await fetch(`${API_BASE_URL}/jira/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to create Jira issues");
    }

    const data = await res.json();
    console.log("✅ Issues created:", data);
    return data;
  } catch (err) {
    console.error("❌ Error creating Jira issues:", err);
    throw err;
  }
}

  // async createJiraIssues(state: string, tasks: any[]) {
  //   const response = await this.request(`${API_BASE_URL}/jira/create`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ state, tasks }),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`Failed to create issues: ${response.statusText}`);
  //   }

  //   return response.json();
  // }

  // Parse Word document to tasks
  async parseWordToTasks(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.request(`${API_BASE_URL}/convert/word-to-jira`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to parse Word document: ${response.statusText}`);
    }

    return response.json();
  }

  // Get tasks by state
  async getTasks(state: string) {
    const response = await this.request(`${API_BASE_URL}/tasks/${state}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    return response.json();
  }

  // Clear session
  async clearSession(state: string) {
    const response = await this.request(`${API_BASE_URL}/session/${state}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to clear session: ${response.statusText}`);
    }
    return response.json();
  }

  // Jira to Word conversion
  async jiraToWord(state: string, projectKey?: string, jql?: string) {
    const url = new URL(`${API_BASE_URL}/convert/jira-to-word`);
    if (projectKey) url.searchParams.append("project_key", projectKey);
    if (jql) url.searchParams.append("jql", jql);
    url.searchParams.append("state", state);

    const response = await this.request(url.toString(), {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Jira to Word conversion failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // PDF to Notion conversion
  async pdfToNotion(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.request(`${API_BASE_URL}/convert/pdf-to-notion`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`PDF to Notion conversion failed: ${response.statusText}`);
    }

    return response.json();
  }

  // HTML to PDF conversion
  async htmlToPdf(htmlContent?: string, url?: string) {
    if (url) {
      return this.convertUrl(url, "pdf");
    } else if (htmlContent) {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const file = new File([blob], "content.html", { type: "text/html" });
      return this.convert(file, "pdf");
    } else {
      throw new Error("Either HTML content or URL must be provided");
    }
  }
}

export const pdfApi = new PdfAPI();
