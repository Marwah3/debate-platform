import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Konfigurasi agar Prisma Client disertakan secara eksternal saat dipaketkan oleh Netlify/Vercel serverless */
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;