/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 在开发环境中抑制水合警告
  onDemandEntries: {
    // 页面在内存中保持的时间（毫秒）
    maxInactiveAge: 25 * 1000,
    // 同时保持的页面数
    pagesBufferLength: 2,
  },
  // 编译器选项
  compiler: {
    // 移除console.log（仅在生产环境）
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig