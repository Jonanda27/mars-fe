import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import ServicesSection from '@/components/landing/ServicesSection';
import BillCheckSection from '@/components/landing/BillCheckSection';
import PaymentChannelSection from '@/components/landing/PaymentChannelSection';
import NewsSection from '@/components/landing/NewsSection';
import LandingFooter from '@/components/landing/LandingFooter';
import ChatWidget from '@/components/landing/ChatWidget';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 antialiased selection:bg-[#3c8dbc] selection:text-white">
      {/* 1. Header & Navigation */}
      <LandingNavbar />

      <main>
        {/* 2. Hero Section dengan Background Video Slideshow */}
        <HeroSection />

        {/* 3. Fitur & Layanan Utama (3-Monitor Showcase) */}
        <ServicesSection />

        {/* 4. Cek Tagihan e-SKRD Cepat */}
        <BillCheckSection />

        {/* 5. Kanal Pembayaran Non-Tunai & Pendaftaran Mitra */}
        <PaymentChannelSection />

        {/* 6. Berita & Informasi Resmi */}
        <NewsSection />
      </main>

      {/* 7. Footer Resmi Dishub & UPBU Mozes Kilangin */}
      <LandingFooter />

      {/* 8. Floating Live Chat Widget Customer Service */}
      <ChatWidget />
    </div>
  );
}
