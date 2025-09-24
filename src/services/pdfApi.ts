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

  // Jira authentication with state - Enhanced with better error handling
  async loginJira(state: string): Promise<void> {
    const url = `${API_BASE_URL}/login/jira?state=${state}`;
    console.log('🔵 FRONTEND: Opening Jira auth popup:', url);
    
    const popup = window.open(url, "jira-auth", "width=600,height=700");

    return new Promise((resolve, reject) => {
      let resolved = false;
      
      const cleanup = () => {
        clearInterval(checkClosed);
        window.removeEventListener("message", messageHandler);
      };

      const checkClosed = setInterval(() => {
        if (popup?.closed && !resolved) {
          console.log('🔵 FRONTEND: Popup closed, checking auth status...');
          cleanup();
          resolved = true;
          this.checkJiraStatus(state).then(resolve).catch(reject);
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        console.log('🔵 FRONTEND: Received message:', event.data);
        if (event.data && event.data.type === "jira_auth_success" && event.data.state === state) {
          console.log('✅ FRONTEND: Auth success message received');
          if (!resolved) {
            resolved = true;
            cleanup();
            popup?.close();
            resolve();
          }
        } else if (event.data && event.data.type === "jira_auth_error") {
          console.error('❌ FRONTEND: Auth error message received:', event.data.error);
          if (!resolved) {
            resolved = true;
            cleanup();
            popup?.close();
            reject(new Error(event.data.error || "Authentication failed"));
          }
        }
      };
      
      window.addEventListener("message", messageHandler);

      // Longer timeout for authentication
      setTimeout(() => {
        if (!resolved) {
          console.log('⏰ FRONTEND: Authentication timeout');
          resolved = true;
          cleanup();
          popup?.close();
          reject(new Error("Authentication timeout"));
        }
      }, 300000); // 5 minutes
    });
  }

  // Check Jira authentication status
  async checkJiraStatus(state: string): Promise<void> {
    console.log('🔵 FRONTEND: Checking Jira status for state:', state);
    
    const response = await this.request(
      `${API_BASE_URL}/jira/status?state=${state}`
    );
    const data = await response.json();

    console.log('🔵 FRONTEND: Auth status response:', data);

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

  // ✅ FIXED: Create Jira issues with proper error handling and validation
  async createJiraIssues(
    state: string,
    projectType: "software" | "jsm",
    tasks: any[],
    projectKey?: string,
    serviceDeskId?: string,
    requestTypeId?: string
  ) {
    try {
      console.log('🔵 FRONTEND: Creating Jira issues with params:', {
        state,
        projectType,
        tasksCount: tasks.length,
        projectKey,
        serviceDeskId,
        requestTypeId
      });

      // ✅ Validate required parameters upfront
      if (!state) {
        throw new Error("State is required");
      }

      if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        throw new Error("Tasks array is required and cannot be empty");
      }

      if (projectType === "software" && !projectKey) {
        throw new Error("Project key is required for software projects");
      }

      if (projectType === "jsm" && (!serviceDeskId || !requestTypeId)) {
        throw new Error("Service desk ID and request type ID are required for JSM projects");
      }

      // ✅ Build payload with proper structure matching backend expectations
      const payload: any = {
        state,
        project_type: projectType,
        tasks
      };

      if (projectType === "software") {
        payload.project_key = projectKey;
      }

      if (projectType === "jsm") {
        payload.service_desk_id = serviceDeskId;
        payload.request_type_id = requestTypeId;
      }

      console.log("🚀 FRONTEND: Sending payload to backend:", JSON.stringify(payload, null, 2));

      const res = await fetch(`${API_BASE_URL}/jira/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ FRONTEND: Backend returned error:", {
          status: res.status,
          statusText: res.statusText,
          data
        });

        // ✅ Better error message extraction
        let errorMessage = "Failed to create Jira issues";
        
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            // Pydantic validation errors
            const errors = data.detail.map((err: any) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ');
            errorMessage = `Validation error: ${errors}`;
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else {
            errorMessage = JSON.stringify(data.detail);
          }
        }

        throw new Error(errorMessage);
      }

      console.log("✅ FRONTEND: Issues created successfully:", data);
      return data;
      
    } catch (err) {
      console.error("❌ FRONTEND: Error creating Jira issues:", err);
      throw err;
    }
  }

  // Parse Word document to tasks
  async parseWordToTasks(file: File, state?: string) {
    const formData = new FormData();
    formData.append("file", file);
    
    // ✅ Include state if provided
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
    const response = await this.request(`${API_BASE_URL}/tasks/${state}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch tasks: ${response.statusText} - ${errorText}`);
    }
    return response.json();
  }

  // Clear session
  async clearSession(state: string) {
    const response = await this.request(`${API_BASE_URL}/session/${state}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to clear session: ${response.statusText} - ${errorText}`);
    }
    return response.json();
  }

  // Jira to Word conversion
  async jiraToWord(state: string, projectKey?: string, jql?: string) {
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

  // ✅ NEW: Get login URL for popup-based authentication
  async getLoginUrl(state: string) {
    const response = await this.request(`${API_BASE_URL}/auth/login-url?state=${state}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get login URL: ${response.statusText}`);
    }
    
    return response.json();
  }

  // ✅ NEW: Get user profile information
  async getUserProfile(state: string) {
    const response = await this.request(`${API_BASE_URL}/user/profile?state=${state}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const pdfApi = new PdfAPI();
