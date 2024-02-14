/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "***REMOVED***",
    database: "fairhold",
  },
};

export default nextConfig;
