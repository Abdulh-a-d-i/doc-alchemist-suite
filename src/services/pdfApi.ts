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

// Updated src/services/pdfApi.js with Notion support

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://full-shrimp-deeply.ngrok-free.app";

interface NotionTask {
  summary: string;
  description?: string;
  priority?: string;
  assignee?: string;
  labels?: string[];
  type?: string;
  [key: string]: any;
}

interface NotionOptions {
  state: string;
  tasks: NotionTask[];
  databaseId?: string;
  parentPageId?: string;
  createNewDatabase?: boolean;
  databaseTitle?: string;
}

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
  async convert(file: File, target: string): Promise<{ blob: Blob; fileName: string }> {
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

  const blob = await response.blob();
  const contentDisposition = response.headers.get("content-disposition") || "";
  const contentType = response.headers.get("content-type") || "";
  const originalName = file.name.split(".")[0];

  let fileName = `${originalName}.${target}`;

  // ✅ Always trust backend filename if provided
  const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (match && match[1]) {
    fileName = match[1].replace(/['"]/g, "");
  }

  // ✅ For PDF → JPG, DO NOT assume anything. Just trust backend.
  if (file.name.endsWith(".pdf") && target === "jpg") {
    // If backend didn’t provide a filename, default to .zip
    if (!match) {
      if (contentType.includes("zip")) {
        fileName = `${originalName}.zip`;
      } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        fileName = `${originalName}.jpg`;
      } else {
        fileName = `${originalName}.bin`; // failsafe
      }
    }

    // ✅ Return as-is, don’t mess with blob or filename
    return { blob, fileName };
  }

  // ✅ Fallback for other conversions
  if (!match) {
    if (contentType.includes("zip")) {
      fileName = `${originalName}.zip`;
    } else if (contentType.includes("pdf")) {
      fileName = `${originalName}.pdf`;
    }
  }

  return { blob, fileName };
}

  // Compress PDF files
  async compress(file: File, level: string = "medium"): Promise<Blob> {
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
  async merge(files: File[]): Promise<Blob> {
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

  // Split PDF files
  async split(file: File, pages: string): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("page_ranges", pages);

    const response = await this.request(`${API_BASE_URL}/split`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Split failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // HTML to PDF conversion
  async htmlToPdf(htmlContent?: string, url?: string): Promise<Blob> {
    if (url) {
      const formData = new FormData();
      formData.append("url", url);
      formData.append("target", "pdf");

      const response = await this.request(`${API_BASE_URL}/convert-url`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`URL conversion failed: ${response.statusText}`);
      }

      return response.blob();
    } else if (htmlContent) {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const file = new File([blob], "content.html", { type: "text/html" });
      const result = await this.convert(file, "pdf");
      return result.blob;
    } else {
      throw new Error("Either HTML content or URL must be provided");
    }
  }

  // Jira authentication methods
  async loginJira(state: string): Promise<void> {
    const url = `${API_BASE_URL}/login/jira?state=${state}`;
    const popup = window.open(url, "jira-auth", "width=600,height=700");

    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          this.checkJiraStatus(state).then(() => resolve()).catch(reject);
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

  async checkJiraStatus(state: string): Promise<{ authenticated: boolean }> {
    const response = await this.request(`${API_BASE_URL}/jira/status?state=${state}`);
    const data = await response.json();

    if (!data.authenticated) {
      throw new Error("Jira authentication failed");
    }
    
    return data;
  }

  async getJiraProjects(state: string) {
    const response = await this.request(`${API_BASE_URL}/jira/projects?state=${state}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    return response.json();
  }

  async getJiraLoginUrl(state: string): Promise<{ auth_url: string }> {
    const response = await this.request(`${API_BASE_URL}/auth/jira-login-url?state=${state}`);
    return response.json();
  }

  async getJiraRequestTypes(state: string, serviceDeskId: string) {
    const response = await this.request(`${API_BASE_URL}/jira/request-types?state=${state}&service_desk_id=${serviceDeskId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch request types: ${response.statusText}`);
    }
    return response.json();
  }

  async createJiraIssues(state: string, projectType: "software" | "jsm", tasks: any[], projectKey?: string, serviceDeskId?: string, requestTypeId?: string) {
    const payload: any = {
      state,
      project_type: projectType,
      tasks
    };

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

    const response = await this.request(`${API_BASE_URL}/jira/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Failed to create Jira issues");
    }

    return response.json();
  }

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

  async jiraToWord(state: string, projectKey?: string, jql?: string): Promise<Blob> {
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

  // Notion Authentication
  async loginNotion(state: string): Promise<void> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const url = `${API_BASE_URL}/login/notion?state=${state}`;
    const popup = window.open(url, "notion-auth", "width=600,height=700");

    if (!popup) {
      throw new Error("Failed to open popup window. Please allow popups.");
    }

    return new Promise<void>((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          this.checkNotionStatus(state).then(() => resolve()).catch(reject);
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        if (event.data?.type === "notion_auth_success" || event.data === "notion_auth_success") {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          popup.close();
          resolve();
        } else if (event.data?.type === "notion_auth_error") {
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

  // Check Notion authentication status
  async checkNotionStatus(state: string): Promise<{ authenticated: boolean }> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/notion/status?state=${state}`);
    return response.json();
  }

  // Get Notion databases
  async getNotionDatabases(state: string): Promise<any> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/notion/databases?state=${state}`);
    return response.json();
  }

  // Get Notion pages
  async getNotionPages(state: string, databaseId?: string): Promise<any> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    let url = `${API_BASE_URL}/notion/pages?state=${state}`;
    if (databaseId) {
      url += `&database_id=${databaseId}`;
    }

    const response = await this.request(url);
    return response.json();
  }

  // Create Notion pages
  async createNotionPages(options: NotionOptions): Promise<any> {
    if (!options || typeof options !== 'object') {
      throw new Error("Options parameter is required and must be an object");
    }

    if (!options.state || typeof options.state !== 'string') {
      throw new Error(`State must be a non-empty string, got: ${typeof options.state} - ${options.state}`);
    }

    if (!options.tasks || !Array.isArray(options.tasks)) {
      throw new Error(`Tasks must be a non-empty array, got: ${typeof options.tasks} - ${options.tasks}`);
    }

    if (options.tasks.length === 0) {
      throw new Error("Tasks array cannot be empty");
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

    // Validate creation options
    if (options.createNewDatabase) {
      if (!options.databaseTitle) {
        throw new Error("databaseTitle is required when createNewDatabase is true");
      }
      if (!options.parentPageId) {
        throw new Error("parentPageId is required when createNewDatabase is true");
      }
    } else if (!options.databaseId) {
      throw new Error("databaseId is required when not creating a new database");
    }

    const payload = {
      state: options.state,
      tasks: options.tasks,
      database_id: options.databaseId,
      parent_page_id: options.parentPageId,
      create_new_database: options.createNewDatabase || false,
      database_title: options.databaseTitle,
    };

    console.log("Sending payload to Notion backend:", JSON.stringify(payload, null, 2));

    try {
      const response = await this.request(`${API_BASE_URL}/notion/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Pages created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating Notion pages:", error);
      throw error;
    }
  }

  // Parse Word document for Notion
  async parseWordToNotionTasks(file: File): Promise<{ state: string; tasks: NotionTask[] }> {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await this.request(`${API_BASE_URL}/convert/word-to-notion`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.tasks || !Array.isArray(data.tasks)) {
      console.error("Invalid tasks from parseWordToNotionTasks:", data.tasks);
      throw new Error("Parsed tasks must be a non-empty array");
    }
    return data;
  }

  // Get Notion tasks by state
  async getNotionTasks(state: string): Promise<{ tasks: NotionTask[]; filename?: string }> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/tasks/notion/${state}`);
    return response.json();
  }

  // Clear Notion session
  async clearNotionSession(state: string): Promise<any> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/session/notion/${state}`, {
      method: "DELETE",
    });
    return response.json();
  }

  // Notion to Word conversion
  async notionToWord(state: string, databaseId?: string, pageIds?: string): Promise<Blob> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const formData = new FormData();
    formData.append("state", state);
    if (databaseId) formData.append("database_id", databaseId);
    if (pageIds) formData.append("page_ids", pageIds);

    const response = await this.request(`${API_BASE_URL}/convert/notion-to-word`, {
      method: "POST",
      body: formData,
    });

    return response.blob();
  }

  // Get Notion user profile
  async getNotionUserProfile(state: string): Promise<any> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/user/notion-profile?state=${state}`);
    return response.json();
  }

  // Get Notion login URL
  async getNotionLoginUrl(state: string): Promise<{ auth_url: string }> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/auth/notion-login-url?state=${state}`);
    return response.json();
  }

  // Enhanced convert method to handle PDF to Jira/Notion
  async convertAdvanced(file: File, target: string): Promise<{ blob: Blob; fileName: string }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);

    // Special handling for PDF to Jira/Notion conversions
    if (file.type === "application/pdf" && (target === "jira" || target === "notion")) {
      // These will return JSON with extracted tasks instead of converted file
      const response = await this.request(`${API_BASE_URL}/convert`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      // Convert the JSON response to a downloadable blob
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { 
        type: "application/json" 
      });
      
      const originalName = file.name.split(".")[0];
      const fileName = `${originalName}_${target}_tasks.json`;
      
      return { blob: jsonBlob, fileName };
    }

    // Standard conversion
    return this.convert(file, target);
  }

  // PDF to specific platform conversions
  async pdfToJira(file: File): Promise<{ tasks: any[]; state: string }> {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", "jira");

    const response = await this.request(`${API_BASE_URL}/convert`, {
      method: "POST",
      body: formData,
    });

    return response.json();
  }

  async pdfToNotion(file: File): Promise<{ tasks: any[]; state: string }> {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", "notion");

    const response = await this.request(`${API_BASE_URL}/convert`, {
      method: "POST",
      body: formData,
    });

    return response.json();
  }

  // Enhanced compress method - fix the broken functionality
  async compressAdvanced(file: File, compressionType: string, level: string = "medium"): Promise<Blob> {
    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();
    formData.append("compress_type", compressionType);
    formData.append("file", file);
    formData.append("level", level);

    const response = await this.request(`${API_BASE_URL}/compress`, {
      method: "POST",
      body: formData,
    });

    return response.blob();
  }

  // Enhanced merge method - fix the broken functionality  
  async mergeAdvanced(files: File[], mergeType: string): Promise<Blob> {
    if (!files || files.length === 0) {
      throw new Error("At least one file is required");
    }

    const formData = new FormData();
    formData.append("merge_type", mergeType);
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await this.request(`${API_BASE_URL}/merge`, {
      method: "POST",
      body: formData,
    });

    return response.blob();
  }

  // Split method - implement the missing functionality
  async splitAdvanced(file: File, pageRanges: string): Promise<Blob> {
    if (!file) {
      throw new Error("File is required");
    }

    if (!pageRanges.trim()) {
      throw new Error("Page ranges are required");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("page_ranges", pageRanges);

    const response = await this.request(`${API_BASE_URL}/split`, {
      method: "POST",
      body: formData,
    });

    return response.blob();
  }

  // Text → Jira using LLM
  async textToJira(text?: string, url?: string): Promise<{ state: string; tasks: any[]; filename: string }> {
    const payload: any = {};
    if (text) payload.text = text;
    if (url) payload.url = url;

    const response = await this.request(`${API_BASE_URL}/convert/text-to-jira`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Text to Jira conversion failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export updated API instance
export const pdfApi = new PdfAPI();
export type { NotionTask, NotionOptions };
