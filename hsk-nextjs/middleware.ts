import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, hasRole } from '@/lib/auth/jwt';

// 需要认证的路由配置
const PROTECTED_ROUTES = {
  // 学生端路由
  student: [
    '/subjects',
    '/practice',
    '/wrong-questions',
    '/profile',
    '/history',
    '/subject-detail'
  ],
  // 教师端路由
  teacher: [
    '/teacher'
  ],
  // 管理员端路由
  admin: [
    '/admin'
  ]
};

// 公开路由（不需要认证）
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/home',
  '/api/auth/login'
];

// API路由权限配置
const API_PERMISSIONS = {
  '/api/subjects': ['admin', 'teacher'],
  '/api/questions': ['admin', 'teacher'],
  '/api/users': ['admin'],
  '/api/practice': ['student', 'teacher', 'admin'],
  '/api/ai': ['admin', 'teacher']
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态文件和Next.js内部路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 检查是否为公开路由
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 获取用户信息
  const user = await getUserFromRequest(request);

  // 如果用户未登录，重定向到登录页
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 检查用户账号状态（如果有相关字段）
  // 这里可以添加额外的用户状态检查

  // API路由权限检查
  if (pathname.startsWith('/api/')) {
    return handleAPIPermissions(request, user, pathname);
  }

  // 页面路由权限检查
  return handlePagePermissions(request, user, pathname);
}

// 处理API权限
async function handleAPIPermissions(request: NextRequest, user: any, pathname: string) {
  // 查找匹配的API权限配置
  const apiRoute = Object.keys(API_PERMISSIONS).find(route => 
    pathname.startsWith(route)
  );

  if (apiRoute) {
    const allowedRoles = API_PERMISSIONS[apiRoute as keyof typeof API_PERMISSIONS];
    
    if (!hasRole(user.role, allowedRoles)) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: '权限不足',
          requiredRoles: allowedRoles,
          userRole: user.role
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  }

  return NextResponse.next();
}

// 处理页面权限
async function handlePagePermissions(request: NextRequest, user: any, pathname: string) {
  // 管理员端路由检查
  if (pathname.startsWith('/admin')) {
    if (!hasRole(user.role, ['admin'])) {
      return redirectToUnauthorized(request, '管理员');
    }
    return NextResponse.next();
  }

  // 教师端路由检查
  if (pathname.startsWith('/teacher')) {
    if (!hasRole(user.role, ['teacher', 'admin'])) {
      return redirectToUnauthorized(request, '教师');
    }
    return NextResponse.next();
  }

  // 学生端路由检查（学生、教师、管理员都可以访问）
  const isStudentRoute = PROTECTED_ROUTES.student.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  if (isStudentRoute) {
    if (!hasRole(user.role, ['student', 'teacher', 'admin'])) {
      return redirectToUnauthorized(request, '学生');
    }
    return NextResponse.next();
  }

  // 默认允许访问
  return NextResponse.next();
}

// 重定向到未授权页面
function redirectToUnauthorized(request: NextRequest, requiredRole: string) {
  const unauthorizedUrl = new URL('/unauthorized', request.url);
  unauthorizedUrl.searchParams.set('required', requiredRole);
  unauthorizedUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(unauthorizedUrl);
}

// 配置匹配器
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
