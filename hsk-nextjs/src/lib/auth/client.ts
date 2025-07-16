// 客户端认证工具

export interface AdminUser {
  id: string;
  openid: string;
  nickname: string;
  avatar: string;
  role: string;
  extendedInfo: {
    grade: string;
    major: string;
    department: string;
    studentId: string;
  };
  permissions: string[];
}

// 获取存储的token
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin-token');
}

// 获取存储的用户信息
export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('admin-user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// 检查是否已登录
export function isAdminLoggedIn(): boolean {
  const token = getAdminToken();
  const user = getAdminUser();
  return !!(token && user && (user.role === 'admin' || user.role === 'ADMIN'));
}

// 清除登录信息
export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('admin-token');
  localStorage.removeItem('admin-user');
}

// 退出登录
export function adminLogout(): void {
  clearAdminAuth();
  window.location.href = '/admin/login';
}

// 检查用户权限
export function hasAdminPermission(permission: string): boolean {
  const user = getAdminUser();
  if (!user) return false;
  
  return user.permissions.includes(permission);
}

// API请求工具（自动添加认证头）
export async function adminApiRequest(url: string, options: RequestInit = {}) {
  const token = getAdminToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // 如果返回401，说明token过期或无效，跳转到登录页
  if (response.status === 401) {
    clearAdminAuth();
    window.location.href = '/admin/login';
    throw new Error('认证失败，请重新登录');
  }
  
  return response;
}

// 页面认证检查Hook
export function useAdminAuth() {
  const checkAuth = () => {
    if (!isAdminLoggedIn()) {
      window.location.href = '/admin/login';
      return false;
    }
    return true;
  };
  
  return { checkAuth, isLoggedIn: isAdminLoggedIn(), user: getAdminUser() };
}
