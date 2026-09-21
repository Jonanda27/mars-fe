import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/penyewa', destination: '/admin/verifikasi', permanent: false },
      { source: '/aset', destination: '/admin/aset', permanent: false },
      { source: '/kontrak', destination: '/admin/kontrak', permanent: false },
      { source: '/tagihan', destination: '/admin/tagihan', permanent: false },
      { source: '/pembayaran', destination: '/admin/pembayaran', permanent: false },
      { source: '/pemakaian', destination: '/admin', permanent: false },
      { source: '/hitung-tarif', destination: '/admin/tarif', permanent: false },
    ];
  },
};

export default nextConfig;
