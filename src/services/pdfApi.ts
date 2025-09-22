// PDF conversion API service - placeholder for backend integration
// Fill in with your actual backend implementation

const API_BASE_URL = 'http://localhost:3000/api';

class PdfAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async convert(files: File[], conversionType: string) {
    // TODO: Implement actual conversion API call to /convert endpoint
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    formData.append('conversionType', conversionType);

    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Conversion failed');
    }

    return response.blob();
  }

  async compress(files: File[], compressionLevel: string = 'medium') {
    // TODO: Implement actual compression API call to /compress endpoint
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    formData.append('compressionLevel', compressionLevel);

    const response = await fetch(`${API_BASE_URL}/compress`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Compression failed');
    }

    return response.blob();
  }

  async merge(files: File[]) {
    // TODO: Implement actual merge API call to /merge endpoint
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    const response = await fetch(`${API_BASE_URL}/merge`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Merge failed');
    }

    return response.blob();
  }

  async split(file: File, pages: string) {
    // TODO: Implement actual split API call to /split endpoint
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pages', pages);

    const response = await fetch(`${API_BASE_URL}/split`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Split failed');
    }

    return response.blob();
  }

  async jiraToWord(content: string) {
    // TODO: Implement Jira to Word conversion
    const response = await fetch(`${API_BASE_URL}/convert/jira-to-word`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Jira to Word conversion failed');
    }

    return response.blob();
  }

  async wordToJira(file: File) {
    // TODO: Implement Word to Jira conversion
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/convert/word-to-jira`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Word to Jira conversion failed');
    }

    return response.json();
  }

  async notionToPdf(content: string) {
    // TODO: Implement Notion to PDF conversion
    const response = await fetch(`${API_BASE_URL}/convert/notion-to-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Notion to PDF conversion failed');
    }

    return response.blob();
  }

  async htmlToPdf(htmlContent?: string, url?: string) {
    // TODO: Implement HTML to PDF conversion with URL or HTML content
    const response = await fetch(`${API_BASE_URL}/convert/html-to-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ htmlContent, url }),
    });

    if (!response.ok) {
      throw new Error('HTML to PDF conversion failed');
    }

    return response.blob();
  }
}

export const pdfApi = new PdfAPI();