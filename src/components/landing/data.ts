export interface HeroVideoSlide {
  id: number;
  videoSrc: string;
}

export interface AirportSlide {
  id: number;
  imageSrc: string;
  category: string;
  title: string;
  description: string;
  tag: string;
}

export interface NewsItem {
  id: number;
  category: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  imageSrc: string;
  readTime: string;
  author: string;
}

export interface QuickBillResult {
  status: 'PAID' | 'UNPAID' | 'EMERGENCY';
  skrdNo: string;
  invoiceNo: string;
  wajibRetribusi: string;
  layanan: string;
  tglTerbit: string;
  jatuhTempo?: string;
  tglLunas?: string;
  totalTagihan: number;
  noVa: string;
  ntb?: string;
  tokenDarurat?: string;
  keterangan: string;
}

export const heroVideoSlides: HeroVideoSlide[] = [
  { id: 1, videoSrc: '/videos/video1.mp4' },
  { id: 2, videoSrc: '/videos/video3.mp4' },
  { id: 3, videoSrc: '/videos/video2.mp4' },
  { id: 4, videoSrc: '/videos/video4.mp4' }
];

export const airportSlides: AirportSlide[] = [
  {
    id: 1,
    imageSrc: '/images/bandara/mozes-kilangin-terminal.jpg',
    category: 'Objek Retribusi Ruangan',
    title: 'Terminal Penumpang & Garbarata',
    description: 'Tata kelola sewa gerai komersial, counter tiket maskapai, ruang VIP, serta jembatan garbarata.',
    tag: 'Sewa Ruang & Reklame'
  },
  {
    id: 2,
    imageSrc: '/images/bandara/mozes-kilangin-apron.jpg',
    category: 'Objek Retribusi Jasa Pelayanan',
    title: 'Area Parkir Apron Pesawat',
    description: 'Penghitungan tarif pendaratan dan penempatan armada pesawat komersial, perintis, serta helikopter.',
    tag: 'Pendaratan & Parkir'
  },
  {
    id: 3,
    imageSrc: '/images/bandara/mozes-kilangin-gedung.jpg',
    category: 'Objek Retribusi Bangunan',
    title: 'Gedung Utama & Bengkel Hanggar',
    description: 'Penyewaan hanggar perawatan armada (MRO) dan fasilitas perkantoran operasional penerbangan.',
    tag: 'Sewa Hanggar & Lahan'
  },
  {
    id: 4,
    imageSrc: '/images/bandara/mozes-kilangin-aerial.jpg',
    category: 'Kawasan Operasional Bandara',
    title: 'Kawasan Keselamatan Operasi (KKOP)',
    description: 'Integrasi tata kelola aset dan pengawasan retribusi di 14 pos lapangan terbang pedalaman Mimika.',
    tag: '14 Pos Mini Airport'
  }
];

export const newsData: NewsItem[] = [
  {
    id: 1,
    category: 'Transformasi Digital',
    date: '30 September 2026',
    title: 'Implementasi Penuh e-SKRD & QRIS Dinamis Tingkatkan Akuntabilitas PAD Mimika',
    summary: 'Sistem penerbitan SKRD elektronik terintegrasi Bank Papua beroperasi penuh memangkas waktu verifikasi pembayaran mitra penerbangan.',
    content: 'Dinas Perhubungan Kabupaten Mimika resmi mengimplementasikan integrasi menyeluruh layanan digital MARS (Mimika Airport Revenue System) di UPBU Mozes Kilangin. Seluruh Wajib Retribusi kini dapat menerbitkan invoice elektronik dan membayar tagihan secara nontunai melalui Virtual Account Bank Papua serta QRIS dinamis 24 jam.',
    imageSrc: '/images/news/news-1.jpg',
    readTime: '3 min read',
    author: 'Tim Humas Dishub Mimika'
  },
  {
    id: 2,
    category: 'Prestasi & Layanan',
    date: '19 September 2026',
    title: 'Standar Pelayanan Prima UPBU Mozes Kilangin Raih Apresiasi Ditjen Hubud RI',
    summary: 'Peningkatan fasilitas customer service, ketepatan data apron, dan kenyamanan terminal keberangkatan mendapatkan pengakuan nasional.',
    content: 'Kementerian Perhubungan Republik Indonesia melalui Ditjen Perhubungan Udara memberikan apresiasi atas peningkatan mutu layanan di Bandara Mozes Kilangin Timika. Fasilitas customer care dan integrasi data penerbangan digital dinilai berhasil meningkatkan kepuasan penumpang serta mitra maskapai.',
    imageSrc: '/images/news/news-2.jpg',
    readTime: '4 min read',
    author: 'Bagian Operasi Pelayanan'
  },
  {
    id: 3,
    category: 'Penerbangan Pedalaman',
    date: '08 September 2026',
    title: 'Pemberitahuan Cuaca & Keselamatan Operasi Penerbangan Rute Pegunungan Papua Tengah',
    summary: 'Protokol kesiapsiagaan operasional armada perintis menghadapi pola angin muson dan visibilitas di 14 pos lapangan terbang.',
    content: 'Badan Meteorologi dan Otoritas Bandara menerbitkan panduan keselamatan penerbangan untuk operator armada perintis dan charter. Koordinasi pengawasan lapangan diintensifkan pada pos perintis ketinggian guna menjaga keselamatan armada, penumpang, dan kargo logistik.',
    imageSrc: '/images/news/news-3.jpg',
    readTime: '2 min read',
    author: 'Otoritas Keselamatan Bandara'
  },
  {
    id: 4,
    category: 'Infrastruktur & MRO',
    date: '28 Agustus 2026',
    title: 'Optimalisasi Hanggar Perawatan & Penataan Slot Parkir Armada Maskapai Charter',
    summary: 'Penataan jadwal perawatan berkala armada pesawat berbobot MTOW tinggi dengan sistem booking slot terintegrasi MARS.',
    content: 'Untuk mendukung mobilitas armada perintis dan charter tambang, fasilitas hanggar dan area apron Bandara Mozes Kilangin kini menggunakan sistem monitoring kapasitas real-time. Hal ini mencegah bentrok jadwal perawatan dan memastikan transparansi penghitungan retribusi parkir.',
    imageSrc: '/images/news/news-4.jpg',
    readTime: '5 min read',
    author: 'Divisi Fasilitas & Apron'
  },
  {
    id: 5,
    category: 'Tenant & Komersial',
    date: '18 Agustus 2026',
    title: 'Pembukaan Kawasan Kuliner & Gerai UMKM Baru di Terminal Keberangkatan Mozes Kilangin',
    summary: 'Dukungan penuh terhadap pelaku usaha lokal Mimika dengan sistem sewa ruang komersial yang transparan dan akuntabel.',
    content: 'Terminal keberangkatan Bandara Mozes Kilangin kini semakin hidup dengan hadirnya area lounge dan kafe modern bernuansa lokal. Seluruh gerai komersial telah terdata secara digital dalam sistem MARS untuk mempermudah perhitungan sewa ruang dan retribusi daerah secara berkala.',
    imageSrc: '/images/news/news-5.jpg',
    readTime: '3 min read',
    author: 'Unit Pengelolaan Tenant'
  },
  {
    id: 6,
    category: 'Regulasi & Sinergi',
    date: '05 Agustus 2026',
    title: 'Rakor Terpadu Dishub Mimika & Pimpinan Maskapai Bahas Kepatuhan Retribusi Daerah',
    summary: 'Penyamaan persepsi implementasi Perda tarif jasa kebandarudaraan dan kemudahan pelunasan nontunai 24 jam.',
    content: 'Dinas Perhubungan Kabupaten Mimika menggelar forum koordinasi bersama seluruh pimpinan maskapai niaga dan perintis yang beroperasi di Timika. Forum ini memperkuat sinergi antara pemerintah daerah dan mitra penerbangan guna meningkatkan efisiensi dan transparansi pelayanan publik.',
    imageSrc: '/images/news/news-6.jpg',
    readTime: '4 min read',
    author: 'Sekretariat Dishub Mimika'
  }
];
