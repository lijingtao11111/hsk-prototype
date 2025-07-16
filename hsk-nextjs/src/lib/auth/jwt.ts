import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// JWT载荷接口
export interface JWTPayload {
  userId: string;
  openid: string;
  role: 'student' | 'teacher' | 'admin';
  permissions: string[];
  iat?: number;
  exp?: number;
}

// 获取JWT密钥
function getJWTSecret() {
  return new TextEncoder().encode(JWT_SECRET);
}

// 生成JWT token
export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(getJWTSecret());
    
    return token;
  } catch (error) {
    console.error('JWT签名失败:', error);
    throw new Error('Token生成失败');
  }
}

// 验证JWT token
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret());
    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT验证失败:', error);
    return null;
  }
}

// 从请求中提取token
export function extractTokenFromRequest(request: NextRequest): string | null {
  // 从Authorization header中提取
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 从cookie中提取
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

// 从请求中获取用户信息
export async function getUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = extractTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return await verifyJWT(token);
}

// 检查用户权限
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission);
}

// 检查用户角色
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

// 权限常量
export const PERMISSIONS = {
  // 学生权限
  PRACTICE_QUESTIONS: 'practice:questions',
  VIEW_OWN_ANALYSIS: 'analysis:view:own',
  VIEW_OWN_PROGRESS: 'progress:view:own',
  
  // 教师权限
  VIEW_STUDENT_PROGRESS: 'student:progress:view',
  MANAGE_CLASS: 'class:manage',
  REVIEW_QUESTIONS: 'questions:review',
  EDIT_QUESTIONS: 'questions:edit',
  UPLOAD_PAPERS: 'papers:upload',
  VIEW_STUDENT_ANALYSIS: 'analysis:view:student',
  
  // 管理员权限
  MANAGE_USERS: 'users:manage',
  MANAGE_SUBJECTS: 'subjects:manage',
  MANAGE_QUESTIONS: 'questions:manage',
  SYSTEM_CONFIG: 'system:config',
  AI_CONFIG: 'ai:config',
  VIEW_ALL_DATA: 'data:view:all'
} as const;

// 角色权限映射
export const ROLE_PERMISSIONS = {
  student: [
    PERMISSIONS.PRACTICE_QUESTIONS,
    PERMISSIONS.VIEW_OWN_ANALYSIS,
    PERMISSIONS.VIEW_OWN_PROGRESS,
  ],
  teacher: [
    PERMISSIONS.PRACTICE_QUESTIONS,
    PERMISSIONS.VIEW_OWN_ANALYSIS,
    PERMISSIONS.VIEW_OWN_PROGRESS,
    PERMISSIONS.VIEW_STUDENT_PROGRESS,
    PERMISSIONS.MANAGE_CLASS,
    PERMISSIONS.REVIEW_QUESTIONS,
    PERMISSIONS.EDIT_QUESTIONS,
    PERMISSIONS.UPLOAD_PAPERS,
    PERMISSIONS.VIEW_STUDENT_ANALYSIS,
  ],
  admin: [
    ...Object.values(PERMISSIONS),
  ],
};

// 获取角色的默认权限
export function getDefaultPermissions(role: 'student' | 'teacher' | 'admin'): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

// 创建认证中间件
export function createAuthMiddleware(requiredPermissions?: string[], requiredRoles?: string[]) {
  return async (request: NextRequest) => {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: '未授权访问' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 检查角色权限
    if (requiredRoles && !hasRole(user.role, requiredRoles)) {
      return new Response(
        JSON.stringify({ success: false, error: '权限不足' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 检查具体权限
    if (requiredPermissions) {
      const hasRequiredPermissions = requiredPermissions.every(permission =>
        hasPermission(user.permissions, permission)
      );
      
      if (!hasRequiredPermissions) {
        return new Response(
          JSON.stringify({ success: false, error: '权限不足' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return null; // 通过验证
  };
}

// Token刷新
export async function refreshToken(oldToken: string): Promise<string | null> {
  const payload = await verifyJWT(oldToken);
  if (!payload) {
    return null;
  }

  // 创建新的token（移除旧的时间戳）
  const { iat, exp, ...newPayload } = payload;
  return await signJWT(newPayload);
}
