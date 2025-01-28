/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
  },
  webpack: (config) => { 
    config.module.rules.push({ 
      test: /\.md$/, 
      type: 'asset/source', 
    }); 
    return config; 
  }, 
};

export default nextConfig;
