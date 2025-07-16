import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { connectDB } from '@/lib/database/connection';
import { SystemConfig } from '@/lib/database/models/SystemConfig';
import { getUserFromRequest, PERMISSIONS, hasPermission } from '@/lib/auth/jwt';
import { zjcfAgentClient } from '@/lib/ai/zjcf-agent-client';

// POST /api/teacher/upload - 教师端文件上传
export async function POST(request: NextRequest) {
  try {
    // 验证教师权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.UPLOAD_PAPERS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    // 获取上传配置
    const maxFileSize = await SystemConfig.getConfig('upload.max_file_size', 50); // MB
    const allowedTypes = await SystemConfig.getConfig('upload.allowed_types', ['pdf', 'doc', 'docx', 'txt']);

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const processingType = formData.get('processingType') as string || 'auto';
    const examInfo = JSON.parse(formData.get('examInfo') as string || '{}');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: '没有选择文件' },
        { status: 400 }
      );
    }

    const uploadResults: any[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'teacher');

    // 确保上传目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      try {
        // 验证文件大小
        if (file.size > maxFileSize * 1024 * 1024) {
          uploadResults.push({
            filename: file.name,
            success: false,
            error: `文件大小超过限制 (${maxFileSize}MB)`
          });
          continue;
        }

        // 验证文件类型
        const fileExtension = path.extname(file.name).toLowerCase().substring(1);
        if (!allowedTypes.includes(fileExtension)) {
          uploadResults.push({
            filename: file.name,
            success: false,
            error: `不支持的文件类型: ${fileExtension}`
          });
          continue;
        }

        // 生成唯一文件名
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}_${file.name}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        // 保存文件
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // 创建上传记录
        const uploadRecord = {
          filename: uniqueFilename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          uploadTime: new Date(),
          uploadedBy: user.userId,
          userRole: 'teacher',
          status: 'uploaded',
          examInfo: examInfo
        };

        // 根据处理类型进行处理
        let processResult = null;
        if (processingType === 'auto') {
          try {
            uploadRecord.status = 'processing';
            
            // 调用AI Agent进行文档解析
            const parseResult = await zjcfAgentClient.parseDocument({
              documentUrl: `/uploads/teacher/${uniqueFilename}`,
              documentType: getDocumentType(fileExtension),
              examInfo: {
                name: examInfo.name || file.name,
                date: examInfo.date || new Date().toISOString(),
                subjectId: examInfo.subjectId || 'general',
                subjectName: examInfo.subjectName || '通用',
                level: examInfo.level,
                chapter: examInfo.chapter
              }
            });

            if (parseResult.success) {
              uploadRecord.status = 'completed';
              processResult = parseResult.data;
              
              // 这里可以将解析的题目保存到数据库
              // await saveQuestionsToDatabase(parseResult.data.questions, user.userId);
              
            } else {
              uploadRecord.status = 'failed';
              processResult = { error: parseResult.error };
            }
          } catch (error) {
            console.error('文档解析失败:', error);
            uploadRecord.status = 'failed';
            processResult = { error: '文档解析失败' };
          }
        }

        uploadRecord.processResult = processResult;

        // 这里应该将上传记录保存到数据库
        // await saveUploadRecord(uploadRecord);

        uploadResults.push({
          filename: file.name,
          success: true,
          data: {
            ...uploadRecord,
            size: formatFileSize(uploadRecord.size)
          }
        });

      } catch (error) {
        console.error(`文件 ${file.name} 上传失败:`, error);
        uploadResults.push({
          filename: file.name,
          success: false,
          error: '文件上传失败'
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        results: uploadResults,
        summary: {
          total: files.length,
          success: uploadResults.filter(r => r.success).length,
          failed: uploadResults.filter(r => !r.success).length
        }
      }
    });

  } catch (error) {
    console.error('教师端文件上传处理失败:', error);
    return NextResponse.json(
      { success: false, error: '文件上传处理失败' },
      { status: 500 }
    );
  }
}

// GET /api/teacher/upload - 获取教师的上传历史
export async function GET(request: NextRequest) {
  try {
    // 验证教师权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.UPLOAD_PAPERS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    // 这里应该从数据库获取该教师的上传历史
    // 目前返回模拟数据
    const mockHistory = [
      {
        id: '1',
        filename: '2023年HSK四级真题.pdf',
        originalName: '2023年HSK四级真题.pdf',
        size: formatFileSize(2.4 * 1024 * 1024),
        uploadTime: new Date('2024-01-15T14:30:00'),
        status: 'completed',
        questionsCount: 45,
        examInfo: {
          name: '2023年HSK四级真题',
          subjectName: 'HSK四级',
          level: '中级'
        }
      },
      {
        id: '2',
        filename: '大学英语四级模拟题.docx',
        originalName: '大学英语四级模拟题.docx',
        size: formatFileSize(1.8 * 1024 * 1024),
        uploadTime: new Date('2024-01-14T16:45:00'),
        status: 'processing',
        questionsCount: 0,
        examInfo: {
          name: '大学英语四级模拟题',
          subjectName: '大学英语',
          level: '中级'
        }
      },
      {
        id: '3',
        filename: '高等数学期末考试.pdf',
        originalName: '高等数学期末考试.pdf',
        size: formatFileSize(3.1 * 1024 * 1024),
        uploadTime: new Date('2024-01-13T10:20:00'),
        status: 'completed',
        questionsCount: 32,
        examInfo: {
          name: '高等数学期末考试',
          subjectName: '高等数学',
          level: '高级'
        }
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        uploads: mockHistory
      }
    });

  } catch (error) {
    console.error('获取教师上传历史失败:', error);
    return NextResponse.json(
      { success: false, error: '获取上传历史失败' },
      { status: 500 }
    );
  }
}

// 辅助函数：获取文档类型
function getDocumentType(extension: string): 'pdf' | 'word' | 'image' {
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    default:
      return 'pdf';
  }
}

// 辅助函数：格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
