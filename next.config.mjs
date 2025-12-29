/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed ignoreBuildErrors - we want to catch TypeScript errors at build time
  // Removed unoptimized images - use Next.js built-in image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig
