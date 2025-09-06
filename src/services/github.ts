export class GitHubService {
  private static instance: GitHubService;
  
  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('github-token');
    return !!token;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('github-token');
  }

  async validateToken(): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }

  getConnectionStatus(): 'connected' | 'disconnected' {
    return this.isAuthenticated() ? 'connected' : 'disconnected';
  }
}