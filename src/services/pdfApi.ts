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

  // 🔑 Central helper to inject headers into every fetch
  private async request(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "ngrok-skip-browser-warning": "true", // bypass ngrok banner
        "Accept": "application/json, text/plain, */*",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.statusText} - ${errorText}`);
    }

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

    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          this.checkJiraStatus(state).then(resolve).catch(reject);
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        if (event.data === "jira_auth_success") {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          popup.close();
          resolve();
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
  async checkJiraStatus(state: string): Promise<void> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/jira/status?state=${state}`);
    const data = await response.json();

    if (!data.authenticated) {
      throw new Error("Jira authentication failed");
    }
  }

  // Get Jira projects
  async getJiraProjects(state: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/jira/projects?state=${state}`);
    return response.json();
  }

  // Get Jira request types for Service Desk
  async getJiraRequestTypes(state: string, serviceDeskId: string) {
    if (!state || !serviceDeskId) {
      throw new Error("State and serviceDeskId are required");
    }

    const response = await this.request(
      `${API_BASE_URL}/jira/request-types?state=${state}&service_desk_id=${serviceDeskId}`
    );
    return response.json();
  }

  // Create Jira issues
  async createJiraIssues(
    optionsOrState: JiraOptions | string,
    projectType?: "software" | "jsm",
    tasks?: JiraTask[],
    projectKey?: string,
    serviceDeskId?: string,
    requestTypeId?: string
  ): Promise<any> {
    let options: JiraOptions;

    // Handle both object and individual parameter calls
    if (typeof optionsOrState === 'object') {
      options = optionsOrState;
    } else {
      options = {
        state: optionsOrState,
        projectType: projectType!,
        tasks: tasks!,
        projectKey,
        serviceDeskId,
        requestTypeId,
      };
    }

    // Log inputs for debugging
    console.log("Creating Jira issues with options:", {
      state: options.state,
      projectType: options.projectType,
      tasks: options.tasks ? `Array(${options.tasks.length})` : 'undefined/null',
      tasksType: typeof options.tasks,
      tasksIsArray: Array.isArray(options.tasks),
      projectKey: options.projectKey,
      serviceDeskId: options.serviceDeskId,
      requestTypeId: options.requestTypeId,
    });

    // Validate inputs
    if (!options.state || typeof options.state !== 'string') {
      throw new Error("State must be a non-empty string");
    }

    if (Array.isArray(options.projectType)) {
      console.error("Invalid projectType:", options.projectType);
      throw new Error("Project type must be 'software' or 'jsm', received an array");
    }

    if (!options.projectType || !["software", "jsm"].includes(options.projectType)) {
      throw new Error("Project type must be 'software' or 'jsm'");
    }

    if (!options.tasks || !Array.isArray(options.tasks)) {
      console.error("Invalid tasks:", options.tasks);
      throw new Error("Tasks must be a non-empty array");
    }

    if (options.tasks.length === 0) {
      throw new Error("Tasks array cannot be empty");
    }

    if (options.projectType === "software" && !options.projectKey) {
      throw new Error("projectKey is required for software projects");
    }

    if (options.projectType === "jsm" && (!options.serviceDeskId || !options.requestTypeId)) {
      throw new Error("serviceDeskId and requestTypeId are required for JSM projects");
    }

    // Validate task structure
    options.tasks.forEach((task, index) => {
      if (!task || typeof task !== 'object' || !task.summary || typeof task.summary !== 'string') {
        throw new Error(`Task at index ${index} is invalid: must be an object with a 'summary' string`);
      }
    });

    // Build payload
    const payload: any = {
      state: options.state,
      project_type: options.projectType,
      tasks: options.tasks,
    };

    if (options.projectType === "software") {
      payload.project_key = options.projectKey;
    }

    if (options.projectType === "jsm") {
      payload.service_desk_id = options.serviceDeskId;
      payload.request_type_id = options.requestTypeId;
    }

    console.log("🚀 Sending payload to backend:", JSON.stringify(payload, null, 2));

    const response = await this.request(`${API_BASE_URL}/jira/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("✅ Issues created:", data);
    return data;
  }

  // Parse Word document to tasks
  async parseWordToTasks(file: File) {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await this.request(`${API_BASE_URL}/convert/word-to-jira`, {
      method: "POST",
      body: formData,
    });

    return response.json();
  }

  // Get tasks by state
  async getTasks(state: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/tasks/${state}`);
    return response.json();
  }

  // Clear session
  async clearSession(state: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/session/${state}`, {
      method: "DELETE",
    });
    return response.json();
  }

  // Jira to Word conversion
  async jiraToWord(state: string, projectKey?: string, jql?: string) {
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
  async pdfToNotion(file: File) {
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
