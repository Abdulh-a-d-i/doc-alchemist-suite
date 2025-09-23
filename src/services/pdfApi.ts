// PDF conversion and processing API service with backend integration

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

class PdfAPI {
  private sessionId: string | null = null;

  // Convert files using the /convert endpoint
  async convert(file: File, target: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target', target);

    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
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
    formData.append('url', url);
    formData.append('target', target);

    const response = await fetch(`${API_BASE_URL}/convert-url`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`URL conversion failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Compress PDF files
  async compress(file: File, level: string = 'medium') {
    const formData = new FormData();
    formData.append('compress_type', 'pdf');
    formData.append('file', file);
    formData.append('level', level);

    const response = await fetch(`${API_BASE_URL}/compress`, {
      method: 'POST',
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
    formData.append('merge_type', 'pdf');
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/merge`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Merge failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Split PDF (not in backend spec, keeping for compatibility)
  async split(file: File, pages: string) {
    throw new Error('Split functionality not available in current backend');
  }

  // Jira authentication
  async loginJira(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/login/jira`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Jira login failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.sessionId = data.session_id;
    return data.session_id;
  }

  // Jira to Word conversion
  async jiraToWord(projectKey: string, jql?: string) {
    if (!this.sessionId) {
      throw new Error('Please login to Jira first');
    }

    const url = new URL(`${API_BASE_URL}/convert/jira-to-word`);
    url.searchParams.append('session_id', this.sessionId);
    url.searchParams.append('project_key', projectKey);
    if (jql) {
      url.searchParams.append('jql', jql);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Jira to Word conversion failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Word to Jira conversion
  async wordToJira(file: File, projectKey: string) {
    if (!this.sessionId) {
      throw new Error('Please login to Jira first');
    }

    const url = new URL(`${API_BASE_URL}/convert/word-to-jira`);
    url.searchParams.append('session_id', this.sessionId);
    url.searchParams.append('project_key', projectKey);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Word to Jira conversion failed: ${response.statusText}`);
    }

    return response.json();
  }

  // PDF to Notion conversion
  async pdfToNotion(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/convert/pdf-to-notion`, {
      method: 'POST',
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
      return this.convertUrl(url, 'pdf');
    } else if (htmlContent) {
      // Create temporary HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const file = new File([blob], 'content.html', { type: 'text/html' });
      return this.convert(file, 'pdf');
    } else {
      throw new Error('Either HTML content or URL must be provided');
    }
  }
}

export const pdfApi = new PdfAPI();