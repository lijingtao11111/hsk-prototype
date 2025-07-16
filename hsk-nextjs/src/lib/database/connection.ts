import mongoose from 'mongoose';
import { memoryDB } from './memory-db';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hsk-exam-system';
const USE_MEMORY_DB = process.env.USE_MEMORY_DB === 'true' || true; // 默认使用内存数据库

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // 如果使用内存数据库，直接返回
  if (USE_MEMORY_DB) {
    console.log('✅ 使用内存数据库 (开发模式)');
    return null;
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB连接成功');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB连接失败:', error);
      throw error;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export async function disconnectDB() {
  if (USE_MEMORY_DB) {
    return;
  }

  if (cached!.conn) {
    await cached!.conn.disconnect();
    cached!.conn = null;
    cached!.promise = null;
    console.log('🔌 MongoDB连接已断开');
  }
}

// 导出内存数据库
export { memoryDB };
