import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ErrorBoundary from '../components/ErrorBoundary';

// 选择适合中文显示的字体
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '多专业智能考试系统',
  description: '浙江财经大学多专业智能考试系统，提供多学科多专业考试练习',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 添加Remix图标 */}
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}