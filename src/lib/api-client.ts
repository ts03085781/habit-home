import { APIResponse } from './validations';

class APIClient {
  private baseURL = '/api';
  private token?: string;
  private refreshToken?: string;

  setTokens(accessToken: string, refreshToken: string) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    
    // 儲存到localStorage | Store to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  getTokens() {
    if (typeof window !== 'undefined') {
      return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      };
    }
    return { accessToken: null, refreshToken: null };
  }

  clearTokens() {
    this.token = undefined;
    this.refreshToken = undefined;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.refreshToken || this.getTokens().refreshToken;
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) return false;

      const data: APIResponse = await response.json();
      if (data.success && data.data) {
        this.setTokens(data.data.token, data.data.refreshToken);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const currentToken = this.token || this.getTokens().accessToken;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
      ...options?.headers,
    };

    try {
      let response = await fetch(url, { ...options, headers });

      // 如果是401錯誤，嘗試刷新token | If it's a 401 error, try to refresh token
      if (response.status === 401 && currentToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // 重新嘗試請求 | Retry the request
          const newToken = this.token || this.getTokens().accessToken;
          response = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`
            }
          });
        }
      }

      const data: APIResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  // 認證相關方法 | Authentication related methods
  async register(data: { email: string; password: string; name: string; confirmPassword: string }, locale: string = 'en') {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, locale })
    });

    if (response.success && response.data) {
      const data = response.data as any;
      this.setTokens(data.token, data.refreshToken);
    }

    return response;
  }

  async login(email: string, password: string, locale: string = 'en') {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, locale })
    });

    if (response.success && response.data) {
      const data = response.data as any;
      this.setTokens(data.token, data.refreshToken);
    }

    return response;
  }

  async logout() {
    this.clearTokens();
    // 可以添加服務器端登出邏輯 | Can add server-side logout logic
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }

  // 家庭管理方法 | Family management methods
  async getFamilies() {
    return this.request('/families', { method: 'GET' });
  }

  async createFamily(data: { name: string; description?: string }) {
    return this.request('/families', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async joinFamily(inviteCode: string) {
    return this.request('/families/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode })
    });
  }

  async getFamily(id: string) {
    return this.request(`/families/${id}`, { method: 'GET' });
  }

  // 任務管理方法 | Task management methods
  async getTasks(familyId?: string) {
    const query = familyId ? `?familyId=${familyId}` : '';
    return this.request(`/tasks${query}`, { method: 'GET' });
  }

  async createTask(data: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateTask(id: string, data: any) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  async completeTask(id: string) {
    return this.request(`/tasks/${id}/complete`, { method: 'POST' });
  }

  // 統計數據方法 | Statistics data methods
  async getStats() {
    return this.request('/stats', { method: 'GET' });
  }
}

export const apiClient = new APIClient();