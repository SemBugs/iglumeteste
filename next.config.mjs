/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['dummyimage.com'],
    unoptimized: true,
  },
  basePath: '/calculadora-lajes',
  output: 'export',
};


export default nextConfig;
