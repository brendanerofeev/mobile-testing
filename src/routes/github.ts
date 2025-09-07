import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

@customElement('github-page')
export class GitHubPage extends LitElement {
  private _githubToken: string | null = null;
  private _isAuthenticated = false;
  private _loading = false;
  private _error: string | null = null;
  private _user: GitHubUser | null = null;
  private _issues: GitHubIssue[] = [];
  private _repositoryUrl = '';
  private _showNewIssueForm = false;
  private _newIssueTitle = '';
  private _newIssueBody = '';

  get githubToken() { return this._githubToken; }
  set githubToken(value: string | null) {
    this._githubToken = value;
    this.requestUpdate();
  }

  get isAuthenticated() { return this._isAuthenticated; }
  set isAuthenticated(value: boolean) {
    this._isAuthenticated = value;
    this.requestUpdate();
  }

  get loading() { return this._loading; }
  set loading(value: boolean) {
    this._loading = value;
    this.requestUpdate();
  }

  get error() { return this._error; }
  set error(value: string | null) {
    this._error = value;
    this.requestUpdate();
  }

  get user() { return this._user; }
  set user(value: GitHubUser | null) {
    this._user = value;
    this.requestUpdate();
  }

  get issues() { return this._issues; }
  set issues(value: GitHubIssue[]) {
    this._issues = value;
    this.requestUpdate();
  }

  get repositoryUrl() { return this._repositoryUrl; }
  set repositoryUrl(value: string) {
    this._repositoryUrl = value;
    this.requestUpdate();
  }

  get showNewIssueForm() { return this._showNewIssueForm; }
  set showNewIssueForm(value: boolean) {
    this._showNewIssueForm = value;
    this.requestUpdate();
  }

  get newIssueTitle() { return this._newIssueTitle; }
  set newIssueTitle(value: string) {
    this._newIssueTitle = value;
    this.requestUpdate();
  }

  get newIssueBody() { return this._newIssueBody; }
  set newIssueBody(value: string) {
    this._newIssueBody = value;
    this.requestUpdate();
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: system-ui, -apple-system, sans-serif;
      color: white;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 3rem;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .content {
      display: grid;
      gap: 2rem;
      grid-template-columns: 1fr;
    }

    @media (min-width: 768px) {
      .content {
        grid-template-columns: 1fr 2fr;
      }
    }

    .auth-section,
    .user-section,
    .issues-section {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .auth-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
    }

    .auth-status.connected {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.4);
    }

    .auth-status.disconnected {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.4);
    }

    .status-icon {
      font-size: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .user-details h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
    }

    .user-details p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.9rem;
    }

    .user-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }

    .stat-item {
      text-align: center;
      background: rgba(255, 255, 255, 0.05);
      padding: 1rem;
      border-radius: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .input-group {
      margin-bottom: 1rem;
    }

    .input-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .input-group input,
    .input-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      resize: vertical;
      box-sizing: border-box;
    }

    .input-group input::placeholder,
    .input-group textarea::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .btn {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      color: white;
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;
      margin: 0.25rem;
      font-size: 0.9rem;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .btn-primary {
      background: rgba(59, 130, 246, 0.3);
      border-color: rgba(59, 130, 246, 0.5);
    }

    .btn-primary:hover {
      background: rgba(59, 130, 246, 0.4);
    }

    .btn-danger {
      background: rgba(239, 68, 68, 0.3);
      border-color: rgba(239, 68, 68, 0.5);
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.4);
    }

    .btn-success {
      background: rgba(34, 197, 94, 0.3);
      border-color: rgba(34, 197, 94, 0.5);
    }

    .btn-success:hover {
      background: rgba(34, 197, 94, 0.4);
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 0.5rem;
      padding: 1rem;
      color: #fca5a5;
      text-align: center;
      margin-bottom: 1rem;
    }

    .success-message {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 0.5rem;
      padding: 1rem;
      color: #86efac;
      text-align: center;
      margin-bottom: 1rem;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .issue-item {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .issue-title {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .issue-meta {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 0.5rem;
    }

    .issue-body {
      font-size: 0.9rem;
      line-height: 1.4;
      opacity: 0.9;
    }

    .nav-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .nav-link {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      margin: 0.5rem;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .form-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .help-text {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadGitHubAuth();
  }

  private loadGitHubAuth() {
    const token = localStorage.getItem('github-token');
    if (token) {
      this.githubToken = token;
      this.isAuthenticated = true;
      this.loadUserInfo();
    }
    
    const repoUrl = localStorage.getItem('github-repository-url');
    if (repoUrl) {
      this.repositoryUrl = repoUrl;
    }
  }

  private async authenticateWithGitHub() {
    const token = prompt('Enter your GitHub Personal Access Token:\n\nTo create one:\n1. Go to GitHub Settings > Developer settings > Personal access tokens\n2. Generate new token (classic)\n3. Select "repo" scope for private repos or "public_repo" for public repos\n4. Copy the token and paste it here');
    
    if (!token) return;

    try {
      this.loading = true;
      this.error = null;

      // Test the token by making a request to the GitHub API
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Invalid GitHub token');
      }

      const user = await response.json();
      console.log('GitHub user authenticated:', user.login);
      
      this.githubToken = token;
      this.isAuthenticated = true;
      this.user = user;
      localStorage.setItem('github-token', token);
      
      this.error = null;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to authenticate with GitHub';
    } finally {
      this.loading = false;
    }
  }

  private async loadUserInfo() {
    if (!this.isAuthenticated) return;

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        this.user = await response.json();
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  }

  private logout() {
    this.githubToken = null;
    this.isAuthenticated = false;
    this.user = null;
    this.issues = [];
    localStorage.removeItem('github-token');
    localStorage.removeItem('github-repository-url');
    this.repositoryUrl = '';
  }

  private async loadIssues() {
    if (!this.isAuthenticated || !this.repositoryUrl) return;

    try {
      this.loading = true;
      this.error = null;

      // Extract owner and repo from URL
      const match = this.repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub repository URL');
      }

      const [, owner, repo] = match;
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load issues');
      }

      this.issues = await response.json();
      localStorage.setItem('github-repository-url', this.repositoryUrl);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load issues';
    } finally {
      this.loading = false;
    }
  }

  private async createIssue() {
    if (!this.isAuthenticated || !this.repositoryUrl || !this.newIssueTitle.trim()) return;

    try {
      this.loading = true;
      this.error = null;

      // Extract owner and repo from URL
      const match = this.repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub repository URL');
      }

      const [, owner, repo] = match;
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: this.newIssueTitle.trim(),
          body: this.newIssueBody.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create issue');
      }

      const newIssue = await response.json();
      this.issues = [newIssue, ...this.issues];
      this.newIssueTitle = '';
      this.newIssueBody = '';
      this.showNewIssueForm = false;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to create issue';
    } finally {
      this.loading = false;
    }
  }

  private handleRepositoryUrlChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.repositoryUrl = input.value;
  }

  private handleNewIssueTitleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newIssueTitle = input.value;
  }

  private handleNewIssueBodyChange(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.newIssueBody = textarea.value;
  }

  render() {
    return html`
      <div class="container">
        <header class="header">
          <h1>🐙 GitHub Integration</h1>
          <p>Connect to GitHub and manage your repositories and issues</p>
        </header>

        <main class="content">
          <!-- Authentication & User Section -->
          <section class="auth-section">
            <h2 class="section-title">
              🔐 Authentication & Profile
            </h2>

            <div class="auth-status ${this.isAuthenticated ? 'connected' : 'disconnected'}">
              <span class="status-icon">
                ${this.isAuthenticated ? '🟢' : '🔴'}
              </span>
              <span>
                ${this.isAuthenticated ? 'Connected to GitHub' : 'Not connected to GitHub'}
              </span>
            </div>

            ${!this.isAuthenticated ? html`
              <button 
                class="btn btn-primary" 
                @click=${this.authenticateWithGitHub}
                ?disabled=${this.loading}
              >
                ${this.loading ? html`<span class="loading-spinner"></span>` : ''}
                🔑 Connect to GitHub
              </button>
              
              <div class="help-text">
                <h4>How to get a GitHub Personal Access Token:</h4>
                <ol>
                  <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
                  <li>Click "Generate new token (classic)"</li>
                  <li>Select the "repo" scope for full repository access</li>
                  <li>Copy the generated token and paste it above</li>
                </ol>
              </div>
            ` : html`
              ${this.user ? html`
                <div class="user-section">
                  <div class="user-info">
                    <img 
                      src="${this.user.avatar_url}" 
                      alt="${this.user.login}" 
                      class="user-avatar"
                    />
                    <div class="user-details">
                      <h3>${this.user.name || this.user.login}</h3>
                      <p>@${this.user.login}</p>
                    </div>
                  </div>
                  
                  <div class="user-stats">
                    <div class="stat-item">
                      <div class="stat-value">${this.user.public_repos}</div>
                      <div class="stat-label">Repositories</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">${this.user.followers}</div>
                      <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">${this.user.following}</div>
                      <div class="stat-label">Following</div>
                    </div>
                  </div>
                </div>
              ` : ''}

              <button 
                class="btn btn-danger" 
                @click=${this.logout}
              >
                🚪 Disconnect
              </button>
            `}

            ${this.error ? html`
              <div class="error-message">
                ${this.error}
              </div>
            ` : ''}
          </section>

          <!-- Issues Management Section -->
          <section class="issues-section">
            <h2 class="section-title">
              📋 Issue Management
            </h2>

            ${this.isAuthenticated ? html`
              <div class="input-group">
                <label for="repo-url">GitHub Repository URL:</label>
                <input
                  id="repo-url"
                  type="url"
                  placeholder="https://github.com/owner/repository"
                  .value=${this.repositoryUrl}
                  @input=${this.handleRepositoryUrlChange}
                />
              </div>

              <div style="text-align: center; margin-bottom: 1rem;">
                <button 
                  class="btn btn-primary" 
                  @click=${this.loadIssues}
                  ?disabled=${this.loading || !this.repositoryUrl}
                >
                  ${this.loading ? html`<span class="loading-spinner"></span>` : ''}
                  📋 Load Issues
                </button>
                
                ${this.issues.length > 0 ? html`
                  <button 
                    class="btn btn-success" 
                    @click=${() => this.showNewIssueForm = !this.showNewIssueForm}
                  >
                    ${this.showNewIssueForm ? '❌ Cancel' : '➕ New Issue'}
                  </button>
                ` : ''}
              </div>

              ${this.showNewIssueForm ? html`
                <div class="form-section">
                  <h3>Create New Issue</h3>
                  <div class="input-group">
                    <label for="issue-title">Title:</label>
                    <input
                      id="issue-title"
                      type="text"
                      placeholder="Issue title..."
                      .value=${this.newIssueTitle}
                      @input=${this.handleNewIssueTitleChange}
                    />
                  </div>
                  <div class="input-group">
                    <label for="issue-body">Description (optional):</label>
                    <textarea
                      id="issue-body"
                      placeholder="Issue description..."
                      rows="4"
                      .value=${this.newIssueBody}
                      @input=${this.handleNewIssueBodyChange}
                    ></textarea>
                  </div>
                  <button 
                    class="btn btn-success" 
                    @click=${this.createIssue}
                    ?disabled=${this.loading || !this.newIssueTitle.trim()}
                  >
                    ${this.loading ? html`<span class="loading-spinner"></span>` : ''}
                    ✅ Create Issue
                  </button>
                </div>
              ` : ''}

              ${this.issues.length > 0 ? html`
                <div>
                  <h3>Issues (${this.issues.length})</h3>
                  ${this.issues.map(issue => html`
                    <div class="issue-item">
                      <div class="issue-title">
                        <a href="${issue.html_url}" target="_blank" style="color: #87ceeb; text-decoration: none;">
                          #${issue.number}: ${issue.title}
                        </a>
                        <span style="margin-left: 1rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem; background: ${issue.state === 'open' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(156, 163, 175, 0.3)'};">
                          ${issue.state}
                        </span>
                      </div>
                      <div class="issue-meta">
                        Created by ${issue.user.login} on ${new Date(issue.created_at).toLocaleDateString()}
                      </div>
                      ${issue.body ? html`
                        <div class="issue-body">
                          ${issue.body.substring(0, 200)}${issue.body.length > 200 ? '...' : ''}
                        </div>
                      ` : ''}
                    </div>
                  `)}
                </div>
              ` : ''}
            ` : html`
              <div class="help-text">
                <p>🔐 Please authenticate with GitHub to access issue management features.</p>
                <p>Once connected, you'll be able to:</p>
                <ul>
                  <li>View issues from any public repository</li>
                  <li>Create new issues</li>
                  <li>Access your private repositories (with proper token permissions)</li>
                </ul>
              </div>
            `}
          </section>
        </main>

        <div class="nav-section">
          <nav>
            <a href="/mobile-testing/" class="nav-link">🏠 Home</a>
            <a href="/mobile-testing/about.html" class="nav-link">ℹ️ About</a>
            <a href="/mobile-testing/settings.html" class="nav-link">⚙️ Settings</a>
            <a href="/mobile-testing/issues.html" class="nav-link">📋 Issues (Legacy)</a>
          </nav>
        </div>
      </div>
    `;
  }
}