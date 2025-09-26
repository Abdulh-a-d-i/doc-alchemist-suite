// // PDF conversion and processing API service with backend integration

// const API_BASE_URL =
//   import.meta.env.VITE_BACKEND_URL || "https://full-shrimp-deeply.ngrok-free.app";

// class PdfAPI {
//   private sessionId: string | null = null;

//   // 🔑 central helper to inject headers into every fetch
//   private async request(url: string, options: RequestInit = {}) {
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         ...(options.headers || {}),
//         "ngrok-skip-browser-warning": "true", // bypass ngrok banner
//         "Accept": "application/json, text/plain, */*",
//       },
//     });

//     return response;
//   }

//   // Convert files using the /convert endpoint
//   async convert(file: File, target: string) {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("target", target);

//     const response = await this.request(`${API_BASE_URL}/convert`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Conversion failed: ${response.statusText}`);
//     }

//     return response.blob();
//   }

//   // Convert URL to PDF
//   async convertUrl(url: string, target: string) {
//     const formData = new FormData();
//     formData.append("url", url);
//     formData.append("target", target);

//     const response = await this.request(`${API_BASE_URL}/convert-url`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`URL conversion failed: ${response.statusText}`);
//     }

//     return response.blob();
//   }

//   // Compress PDF files
//   async compress(file: File, level: string = "medium") {
//     const formData = new FormData();
//     formData.append("compress_type", "pdf");
//     formData.append("file", file);
//     formData.append("level", level);

//     const response = await this.request(`${API_BASE_URL}/compress`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Compression failed: ${response.statusText}`);
//     }

//     return response.blob();
//   }

//   // Merge multiple PDF files
//   async merge(files: File[]) {
//     const formData = new FormData();
//     formData.append("merge_type", "pdf");
//     files.forEach((file) => {
//       formData.append("files", file);
//     });

//     const response = await this.request(`${API_BASE_URL}/merge`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Merge failed: ${response.statusText}`);
//     }

//     return response.blob();
//   }

//   // Jira authentication with state
//   async loginJira(state: string): Promise<void> {
//     const url = `${API_BASE_URL}/login/jira?state=${state}`;
//     const popup = window.open(url, "jira-auth", "width=600,height=700");

//     return new Promise((resolve, reject) => {
//       const checkClosed = setInterval(() => {
//         if (popup?.closed) {
//           clearInterval(checkClosed);
//           this.checkJiraStatus(state).then(resolve).catch(reject);
//         }
//       }, 1000);

//       const messageHandler = (event: MessageEvent) => {
//         if (event.data === "jira_auth_success") {
//           clearInterval(checkClosed);
//           popup?.close();
//           window.removeEventListener("message", messageHandler);
//           resolve();
//         }
//       };
//       window.addEventListener("message", messageHandler);

//       setTimeout(() => {
//         clearInterval(checkClosed);
//         popup?.close();
//         window.removeEventListener("message", messageHandler);
//         reject(new Error("Authentication timeout"));
//       }, 300000);
//     });
//   }

//   // Check Jira authentication status
//   async checkJiraStatus(state: string): Promise<void> {
//     const response = await this.request(
//       `${API_BASE_URL}/jira/status?state=${state}`
//     );
//     const data = await response.json();

//     if (!data.authenticated) {
//       throw new Error("Jira authentication failed");
//     }
//   }

//   // Get Jira projects
//   async getJiraProjects(state: string) {
//     const response = await this.request(
//       `${API_BASE_URL}/jira/projects?state=${state}`
//     );
//     if (!response.ok) {
//       throw new Error(`Failed to fetch projects: ${response.statusText}`);
//     }
//     return response.json();
//   }

//   // Get Jira request types for Service Desk
//   async getJiraRequestTypes(state: string, serviceDeskId: string) {
//     const response = await this.request(
//       `${API_BASE_URL}/jira/request-types?state=${state}&service_desk_id=${serviceDeskId}`
//     );
//     if (!response.ok) {
//       throw new Error(`Failed to fetch request types: ${response.statusText}`);
//     }
//     return response.json();
//   }

//   // Create Jira issues
//   async createJiraIssues(
//   state: string,
//   projectType: "software" | "jsm",
//   tasks: any[],
//   projectKey?: string,
//   serviceDeskId?: string,
//   requestTypeId?: string
// ) {
//   try {
//     // ✅ Always send project_type as string + tasks as array
//     const payload: any = {
//       state,
//       project_type: projectType,
//       tasks
//     };

//     if (projectType === "software") {
//       if (!projectKey) {
//         throw new Error("projectKey is required for software projects");
//       }
//       payload.project_key = projectKey;
//     }

//     if (projectType === "jsm") {
//       if (!serviceDeskId || !requestTypeId) {
//         throw new Error("serviceDeskId and requestTypeId are required for JSM projects");
//       }
//       payload.service_desk_id = serviceDeskId;
//       payload.request_type_id = requestTypeId;
//     }

//     console.log("🚀 Sending payload to backend:", JSON.stringify(payload, null, 2));

//     const res = await fetch(`${API_BASE_URL}/jira/create`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "ngrok-skip-browser-warning": "true"
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.error("❌ Backend returned error:", data);
//       throw new Error(data.detail || "Failed to create Jira issues");
//     }

//     console.log("✅ Issues created:", data);
//     return data;
//   } catch (err) {
//     console.error("❌ Error creating Jira issues:", err);
//     throw err;
//   }
// }
//   // async createJiraIssues(state: string, tasks: any[]) {
//   //   const response = await this.request(`${API_BASE_URL}/jira/create`, {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify({ state, tasks }),
//   //   });

//   //   if (!response.ok) {
//   //     throw new Error(`Failed to create issues: ${response.statusText}`);
//   //   }

//   //   return response.json();
//   // }

//   // Parse Word document to tasks
//   async parseWordToTasks(file: File) {
//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await this.request(`${API_BASE_URL}/convert/word-to-jira`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to parse Word document: ${response.statusText}`);
//     }

//     return response.json();
//   }

//   // Get tasks by state
//   async getTasks(state: string) {
//     const response = await this.request(`${API_BASE_URL}/tasks/${state}`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch tasks: ${response.statusText}`);
//     }
//     return response.json();
//   }

//   // Clear session
//   async clearSession(state: string) {
//     const response = await this.request(`${API_BASE_URL}/session/${state}`, {
//       method: "DELETE",
//     });
//     if (!response.ok) {
//       throw new Error(`Failed to clear session: ${response.statusText}`);
//     }
//     return response.json();
//   }

//   // Jira to Word conversion
//   async jiraToWord(state: string, projectKey?: string, jql?: string) {
//     const url = new URL(`${API_BASE_URL}/convert/jira-to-word`);
//     if (projectKey) url.searchParams.append("project_key", projectKey);
//     if (jql) url.searchParams.append("jql", jql);
//     url.searchParams.append("state", state);

//     const response = await this.request(url.toString(), {
//       method: "POST",
//     });

//     if (!response.ok) {
//       throw new Error(`Jira to Word conversion failed: ${response.statusText}`);
//     }

//     return response.blob();
//   }

//   // PDF to Notion conversion
//   async pdfToNotion(file: File) {
//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await this.request(`${API_BASE_URL}/convert/pdf-to-notion`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`PDF to Notion conversion failed: ${response.statusText}`);
//     }

//     return response.json();
//   }

//   // HTML to PDF conversion
//   async htmlToPdf(htmlContent?: string, url?: string) {
//     if (url) {
//       return this.convertUrl(url, "pdf");
//     } else if (htmlContent) {
//       const blob = new Blob([htmlContent], { type: "text/html" });
//       const file = new File([blob], "content.html", { type: "text/html" });
//       return this.convert(file, "pdf");
//     } else {
//       throw new Error("Either HTML content or URL must be provided");
//     }
//   }
// }

// export const pdfApi = new PdfAPI();


// Fixed PDF conversion and processing API service with backend integration
// Fixed PDF conversion and processing API service with backend integration

// Complete PDF and Jira API service with bulletproof error handling
// PDF conversion and processing API service with backend integration

// PDF conversion and processing API service with backend integration
// PDF conversion and processing API service with backend integration

// PDF conversion and processing API service with backend integration

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://full-shrimp-deeply.ngrok-free.app";

interface JiraTask {
  summary: string;
  description?: string;
  priority?: string;
  assignee?: string;
  labels?: string[];
  [key: string]: any;
}

interface JiraOptions {
  state: string;
  projectType: "software" | "jsm";
  tasks: JiraTask[];
  projectKey?: string;
  serviceDeskId?: string;
  requestTypeId?: string;
}

class PdfAPI {
  private sessionId: string | null = null;

  // Central helper to inject headers into every fetch
  private async request(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json, text/plain, */*",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.statusText} - ${errorText}`);
    }

    return response;
  }

async convert(file: File, target: string): Promise<Blob & { fileName: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target", target);

  const response = await this.request(`${API_BASE_URL}/convert`, {
    method: "POST",
    body: formData,
  });

  const blob = await response.blob();
  const originalName = file.name.split(".")[0];

  const fileName =
    target === "jpg" && file.name.toLowerCase().endsWith(".pdf")
      ? `${originalName}.zip`
      : `${originalName}.${target === "pdfa" ? "pdf" : target}`;

  // attach filename to blob object
  (blob as any).fileName = fileName;
  return blob as Blob & { fileName: string };
}

  // Convert URL to PDF
  async convertUrl(url: string, target: string): Promise<Blob> {
    if (!url) {
      throw new Error("URL is required");
    }
    if (!target) {
      throw new Error("Target format is required");
    }

    const formData = new FormData();
    formData.append("url", url);
    formData.append("target", target);

    const response = await this.request(`${API_BASE_URL}/convert-url`, {
      method: "POST",
      body: formData,
    });

    return response.blob();
  }

  // Compress PDF files
  async compress(file: File, level: string = "medium"): Promise<Blob> {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("compress_type", "pdf");
    formData.append("file", file);
    formData.append("level", level);

    const response = await this.request(`${API_BASE_URL}/compress`, {
      method: "POST",
      body: formData,
    });

    return response.blob();
  }

  // Merge multiple PDF files
  async merge(files: File[]): Promise<Blob> {
    if (!files || files.length === 0) {
      throw new Error("At least one file is required");
    }

    const formData = new FormData();
    formData.append("merge_type", "pdf");
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await this.request(`${API_BASE_URL}/merge`, {
      method: "POST",
      body: formData,
    });

    return response.blob();
  }

  // Jira authentication with state
  async loginJira(state: string): Promise<void> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const url = `${API_BASE_URL}/login/jira?state=${state}`;
    const popup = window.open(url, "jira-auth", "width=600,height=700");

    if (!popup) {
      throw new Error("Failed to open popup window. Please allow popups.");
    }

    return new Promise<void>((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          this.checkJiraStatus(state).then(() => resolve()).catch(reject);
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        if (event.data?.type === "jira_auth_success" || event.data === "jira_auth_success") {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          popup.close();
          resolve();
        } else if (event.data?.type === "jira_auth_error") {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          popup.close();
          reject(new Error(event.data.error || "Authentication failed"));
        }
      };
      window.addEventListener("message", messageHandler);

      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener("message", messageHandler);
        popup.close();
        reject(new Error("Authentication timeout after 5 minutes"));
      }, 300000);
    });
  }

  // Check Jira authentication status
  async checkJiraStatus(state: string): Promise<{ authenticated: boolean }> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/jira/status?state=${state}`);
    return response.json();
  }

  // Get Jira projects
  async getJiraProjects(state: string): Promise<any> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/jira/projects?state=${state}`);
    return response.json();
  }

  // Get Jira request types for Service Desk
  async getJiraRequestTypes(state: string, serviceDeskId: string): Promise<any> {
    if (!state || !serviceDeskId) {
      throw new Error("State and serviceDeskId are required");
    }

    const response = await this.request(
      `${API_BASE_URL}/jira/request-types?state=${state}&service_desk_id=${serviceDeskId}`
    );
    return response.json();
  }

  // Create Jira issues - FIXED VERSION
  async createJiraIssues(options: JiraOptions): Promise<any> {
    // Enhanced validation with better error messages
    if (!options) {
      console.error("CRITICAL ERROR: options is null/undefined");
      throw new Error("Options parameter is required and cannot be null or undefined");
    }

    if (typeof options !== 'object') {
      console.error("CRITICAL ERROR: options is not an object, got:", typeof options, options);
      throw new Error("Options must be an object");
    }

    // Log the actual options received for debugging
    console.log("🔍 DEBUGGING createJiraIssues called with:", {
      optionsType: typeof options,
      optionsKeys: Object.keys(options || {}),
      state: options?.state,
      projectType: options?.projectType,
      tasks: options?.tasks ? `Array(${options.tasks.length})` : 'undefined/null',
      projectKey: options?.projectKey,
      serviceDeskId: options?.serviceDeskId,
      requestTypeId: options?.requestTypeId,
    });

    // Validate required fields
    if (!options.state || typeof options.state !== 'string') {
      throw new Error(`State must be a non-empty string, got: ${typeof options.state} - ${options.state}`);
    }

    if (!options.projectType || !["software", "jsm"].includes(options.projectType)) {
      throw new Error(`Project type must be 'software' or 'jsm', got: ${options.projectType}`);
    }

    if (!options.tasks || !Array.isArray(options.tasks)) {
      throw new Error(`Tasks must be a non-empty array, got: ${typeof options.tasks} - ${options.tasks}`);
    }

    if (options.tasks.length === 0) {
      throw new Error("Tasks array cannot be empty");
    }

    // Validate project-specific requirements
    if (options.projectType === "software" && !options.projectKey) {
      throw new Error("projectKey is required for software projects");
    }

    if (options.projectType === "jsm") {
      if (!options.serviceDeskId) {
        throw new Error("serviceDeskId is required for JSM projects");
      }
      if (!options.requestTypeId) {
        throw new Error("requestTypeId is required for JSM projects");
      }
    }

    // Validate task structure
    options.tasks.forEach((task, index) => {
      if (!task || typeof task !== 'object') {
        throw new Error(`Task at index ${index} must be an object, got: ${typeof task}`);
      }
      if (!task.summary || typeof task.summary !== 'string') {
        throw new Error(`Task at index ${index} must have a 'summary' string property`);
      }
    });

    // Build payload matching backend expectations
    const payload = {
      state: options.state,
      project_type: options.projectType, // Backend expects project_type
      tasks: options.tasks,
      // Add optional fields only if they exist
      ...(options.projectKey && { project_key: options.projectKey }),
      ...(options.serviceDeskId && { service_desk_id: options.serviceDeskId }),
      ...(options.requestTypeId && { request_type_id: options.requestTypeId }),
    };

    console.log("🚀 Sending payload to backend:", JSON.stringify(payload, null, 2));

    try {
      const response = await this.request(`${API_BASE_URL}/jira/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("✅ Issues created successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error creating Jira issues:", error);
      throw error;
    }
  }

  // Parse Word document to tasks
  async parseWordToTasks(file: File): Promise<{ state: string; tasks: JiraTask[] }> {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await this.request(`${API_BASE_URL}/convert/word-to-jira`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.tasks || !Array.isArray(data.tasks)) {
      console.error("Invalid tasks from parseWordToTasks:", data.tasks);
      throw new Error("Parsed tasks must be a non-empty array");
    }
    return data;
  }

  // Get tasks by state
  async getTasks(state: string): Promise<{ tasks: JiraTask[]; filename?: string }> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/tasks/${state}`);
    return response.json();
  }

  // Clear session
  async clearSession(state: string): Promise<any> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/session/${state}`, {
      method: "DELETE",
    });
    return response.json();
  }

  // Jira to Word conversion
  async jiraToWord(state: string, projectKey?: string, jql?: string): Promise<Blob> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const url = new URL(`${API_BASE_URL}/convert/jira-to-word`);
    url.searchParams.append("state", state);
    if (projectKey) url.searchParams.append("project_key", projectKey);
    if (jql) url.searchParams.append("jql", jql);

    const response = await this.request(url.toString(), {
      method: "POST",
    });

    return response.blob();
  }

  // PDF to Notion conversion
  async pdfToNotion(file: File): Promise<any> {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await this.request(`${API_BASE_URL}/convert/pdf-to-notion`, {
      method: "POST",
      body: formData,
    });

    return response.json();
  }
  // Add split functionality
  async split(file: File, pageRanges: string): Promise<Blob[]> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("page_ranges", pageRanges);

    const response = await this.request(`${API_BASE_URL}/split`, {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    return [blob]; // Return as array for consistency
  }

  // Get Jira login URL
  async getJiraLoginUrl(state: string): Promise<{ auth_url: string }> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/login/jira?state=${state}`);
    return response.json();
  }

  // HTML to PDF conversion
  async htmlToPdf(htmlContent?: string, url?: string): Promise<Blob> {
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

  // Get user profile
  async getUserProfile(state: string): Promise<any> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/user/profile?state=${state}`);
    return response.json();
  }
}

// Export singleton instance
export const pdfApi = new PdfAPI();

// Export types for external use
export type { JiraTask, JiraOptions };
