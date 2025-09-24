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

interface CreateJiraOptions {
  state: string;
  projectType: "software" | "jsm";
  tasks: JiraTask[];
  projectKey?: string;
  serviceDeskId?: string;
  requestTypeId?: string;
}

class PdfAPI {
  private sessionId: string | null = null;

  private async request(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "ngrok-skip-browser-warning": "true",
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

  // Enhanced Jira authentication
  async loginJira(state: string): Promise<void> {
    if (!state) {
      throw new Error("State parameter is required for authentication");
    }

    const url = `${API_BASE_URL}/login/jira?state=${state}`;
    console.log('Opening Jira auth popup:', url);
    
    const popup = window.open(url, "jira-auth", "width=600,height=700,scrollbars=yes,resizable=yes");
    
    if (!popup) {
      throw new Error("Failed to open popup window. Please allow popups for this site.");
    }

    return new Promise((resolve, reject) => {
      let resolved = false;
      
      const cleanup = () => {
        clearInterval(checkClosed);
        clearTimeout(timeoutId);
        window.removeEventListener("message", messageHandler);
      };

      const checkClosed = setInterval(() => {
        if (popup.closed && !resolved) {
          console.log('Popup closed, checking auth status...');
          cleanup();
          resolved = true;
          this.checkJiraStatus(state).then(resolve).catch(reject);
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        console.log('Received auth message:', event.data);
        
        if (event.data && typeof event.data === 'object') {
          if (event.data.type === "jira_auth_success" && event.data.state === state) {
            console.log('Auth success confirmed');
            if (!resolved) {
              resolved = true;
              cleanup();
              popup.close();
              resolve();
            }
          } else if (event.data.type === "jira_auth_error") {
            console.error('Auth error received:', event.data.error);
            if (!resolved) {
              resolved = true;
              cleanup();
              popup.close();
              reject(new Error(event.data.error || "Authentication failed"));
            }
          }
        }
      };
      
      window.addEventListener("message", messageHandler);

      const timeoutId = setTimeout(() => {
        if (!resolved) {
          console.log('Authentication timeout');
          resolved = true;
          cleanup();
          popup.close();
          reject(new Error("Authentication timeout after 5 minutes"));
        }
      }, 300000);
    });
  }

  // Check Jira authentication status
  async checkJiraStatus(state: string): Promise<boolean> {
    if (!state) {
      throw new Error("State parameter is required");
    }

    console.log('Checking Jira status for state:', state);
    
    const response = await this.request(
      `${API_BASE_URL}/jira/status?state=${state}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to check auth status: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Auth status response:', data);

    return data.authenticated === true;
  }

  // Get Jira projects
  async getJiraProjects(state: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(
      `${API_BASE_URL}/jira/projects?state=${state}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch projects: ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }

  // Get Jira request types for Service Desk
  async getJiraRequestTypes(state: string, serviceDeskId: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }
    if (!serviceDeskId) {
      throw new Error("Service desk ID is required");
    }

    const response = await this.request(
      `${API_BASE_URL}/jira/request-types?state=${state}&service_desk_id=${serviceDeskId}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch request types: ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }

  // BULLETPROOF Jira issue creation with multiple call signatures
  async createJiraIssues(options: CreateJiraOptions): Promise<any>;
  async createJiraIssues(
    state: string,
    projectType: "software" | "jsm",
    tasks: JiraTask[],
    projectKey?: string,
    serviceDeskId?: string,
    requestTypeId?: string
  ): Promise<any>;
  async createJiraIssues(
    optionsOrState: CreateJiraOptions | string,
    projectType?: "software" | "jsm",
    tasks?: JiraTask[],
    projectKey?: string,
    serviceDeskId?: string,
    requestTypeId?: string
  ): Promise<any> {
    let finalOptions: CreateJiraOptions;

    // Handle both object and individual parameter calls
    if (typeof optionsOrState === 'object') {
      finalOptions = optionsOrState;
    } else {
      finalOptions = {
        state: optionsOrState,
        projectType: projectType!,
        tasks: tasks!,
        projectKey,
        serviceDeskId,
        requestTypeId
      };
    }

    console.log('Creating Jira issues with options:', {
      state: finalOptions.state,
      projectType: finalOptions.projectType,
      tasks: finalOptions.tasks ? `Array(${finalOptions.tasks.length})` : 'undefined/null',
      tasksType: typeof finalOptions.tasks,
      tasksIsArray: Array.isArray(finalOptions.tasks),
      projectKey: finalOptions.projectKey,
      serviceDeskId: finalOptions.serviceDeskId,
      requestTypeId: finalOptions.requestTypeId
    });

    // Comprehensive validation
    if (!finalOptions.state || typeof finalOptions.state !== 'string') {
      throw new Error("State parameter is required and must be a string");
    }

    if (!finalOptions.projectType || !['software', 'jsm'].includes(finalOptions.projectType)) {
      throw new Error("Project type must be either 'software' or 'jsm'");
    }

    if (!finalOptions.tasks) {
      throw new Error("Tasks parameter is required but was undefined or null");
    }
    
    if (!Array.isArray(finalOptions.tasks)) {
      throw new Error(`Tasks must be an array, received: ${typeof finalOptions.tasks}`);
    }
    
    if (finalOptions.tasks.length === 0) {
      throw new Error("Tasks array cannot be empty");
    }

    // Validate project-specific requirements
    if (finalOptions.projectType === "software") {
      if (!finalOptions.projectKey) {
        throw new Error("Project key is required for software projects");
      }
    }

    if (finalOptions.projectType === "jsm") {
      if (!finalOptions.serviceDeskId || !finalOptions.requestTypeId) {
        throw new Error("Service desk ID and request type ID are required for JSM projects");
      }
    }

    // Validate task structure
    finalOptions.tasks.forEach((task, index) => {
      if (!task || typeof task !== 'object') {
        throw new Error(`Task at index ${index} is invalid: must be an object`);
      }
      if (!task.summary || typeof task.summary !== 'string') {
        throw new Error(`Task at index ${index} missing required 'summary' field`);
      }
    });

    try {
      // Build request payload
      const payload: any = {
        state: finalOptions.state,
        project_type: finalOptions.projectType,
        tasks: finalOptions.tasks
      };

      if (finalOptions.projectType === "software") {
        payload.project_key = finalOptions.projectKey;
      }

      if (finalOptions.projectType === "jsm") {
        payload.service_desk_id = finalOptions.serviceDeskId;
        payload.request_type_id = finalOptions.requestTypeId;
      }

      console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_BASE_URL}/jira/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(payload),
      });

      let responseData;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = { error: await response.text() };
      }

      if (!response.ok) {
        console.error("Backend error response:", {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });

        let errorMessage = "Failed to create Jira issues";
        
        if (responseData.detail) {
          if (Array.isArray(responseData.detail)) {
            const errors = responseData.detail.map((err: any) => {
              if (err.loc && err.msg) {
                return `${err.loc.join('.')}: ${err.msg}`;
              }
              return JSON.stringify(err);
            }).join(', ');
            errorMessage = `Validation errors: ${errors}`;
          } else if (typeof responseData.detail === 'string') {
            errorMessage = responseData.detail;
          } else {
            errorMessage = JSON.stringify(responseData.detail);
          }
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }

        throw new Error(errorMessage);
      }

      console.log("Issues created successfully:", responseData);
      return responseData;
      
    } catch (error) {
      console.error("Error creating Jira issues:", error);
      throw error;
    }
  }

  // Parse Word document to tasks
  async parseWordToTasks(file: File, state?: string) {
    if (!file) {
      throw new Error("File parameter is required");
    }

    const formData = new FormData();
    formData.append("file", file);
    
    if (state) {
      formData.append("state", state);
    }

    const response = await this.request(`${API_BASE_URL}/convert/word-to-jira`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to parse Word document: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // Get tasks by state
  async getTasks(state: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/tasks/${state}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch tasks: ${response.statusText} - ${errorText}`);
    }
    
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to clear session: ${response.statusText} - ${errorText}`);
    }
    
    return response.ok ? await response.json() : { message: "Session cleared" };
  }

  // Jira to Word conversion
  async jiraToWord(state: string, projectKey?: string, jql?: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const formData = new FormData();
    formData.append("state", state);
    
    if (projectKey) {
      formData.append("project_key", projectKey);
    }
    
    if (jql) {
      formData.append("jql", jql);
    }

    const response = await this.request(`${API_BASE_URL}/convert/jira-to-word`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira to Word conversion failed: ${response.statusText} - ${errorText}`);
    }

    return response.blob();
  }

  // PDF to Notion conversion
  async pdfToNotion(file: File) {
    if (!file) {
      throw new Error("File parameter is required");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await this.request(`${API_BASE_URL}/convert/pdf-to-notion`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PDF to Notion conversion failed: ${response.statusText} - ${errorText}`);
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

  // Get login URL for popup-based authentication
  async getLoginUrl(state: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/auth/login-url?state=${state}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get login URL: ${response.statusText}`);
    }
    
    return response.json();
  }

  // Get user profile information
  async getUserProfile(state: string) {
    if (!state) {
      throw new Error("State parameter is required");
    }

    const response = await this.request(`${API_BASE_URL}/user/profile?state=${state}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get user profile: ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }
}

export const pdfApi = new PdfAPI();
  }
}

export const pdfApi = new PdfAPI();
