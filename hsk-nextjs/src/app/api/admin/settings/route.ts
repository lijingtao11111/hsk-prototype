import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connection';
import { SystemConfig } from '@/lib/database/models/SystemConfig';
import { getUserFromRequest, PERMISSIONS, hasPermission } from '@/lib/auth/jwt';

// GET /api/admin/settings - 获取系统设置
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.SYSTEM_CONFIG)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // 获取配置
    let configs;
    if (category) {
      configs = await SystemConfig.getConfigsByCategory(category);
    } else {
      configs = await SystemConfig.find({ isActive: true })
        .sort({ category: 1, configKey: 1 })
        .populate('updatedBy', 'nickname')
        .lean();
    }

    // 按分类组织配置
    const configsByCategory = configs.reduce((acc: any, config: any) => {
      if (!acc[config.category]) {
        acc[config.category] = [];
      }
      acc[config.category].push(config);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        configs: configsByCategory,
        categories: Object.keys(configsByCategory)
      }
    });

  } catch (error) {
    console.error('获取系统设置失败:', error);
    return NextResponse.json(
      { success: false, error: '获取系统设置失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - 更新系统设置
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.SYSTEM_CONFIG)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const { configs } = await request.json();

    if (!Array.isArray(configs)) {
      return NextResponse.json(
        { success: false, error: '配置格式错误' },
        { status: 400 }
      );
    }

    // 批量更新配置
    const updatePromises = configs.map(async (config: any) => {
      return await SystemConfig.setConfig(
        config.configKey,
        config.configValue,
        user.userId,
        {
          configName: config.configName,
          description: config.description,
          category: config.category
        }
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      data: { message: '系统设置更新成功' }
    });

  } catch (error) {
    console.error('更新系统设置失败:', error);
    return NextResponse.json(
      { success: false, error: '更新系统设置失败' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - 重置为默认设置
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.SYSTEM_CONFIG)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    // 初始化默认配置
    await SystemConfig.initDefaultConfigs(user.userId);

    return NextResponse.json({
      success: true,
      data: { message: '系统设置已重置为默认值' }
    });

  } catch (error) {
    console.error('重置系统设置失败:', error);
    return NextResponse.json(
      { success: false, error: '重置系统设置失败' },
      { status: 500 }
    );
  }
}
