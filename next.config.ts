import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 서버에서만 사용하는 라이브러리를 externals로 설정
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }
    
    // pdf-parse의 의존성 문제 해결
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        canvas: false,
      },
    };
    
    return config;
  },
};

export default nextConfig;