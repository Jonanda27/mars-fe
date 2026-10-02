"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Building2, 
  Plus,
  KeyRound,
  Edit2,
  Trash2,
  Loader2,
  X,
  Plane,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Lock,
  Landmark,
  Briefcase,
  ClipboardCheck,
  ShieldAlert,
  Check,
  MapPin,
  Sparkles,
  RefreshCw,
  TowerControl
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';
import { UserAccount, AirportOptionsData } from '@/types/user';
import { useAuthStore } from '@/store/useAuthStore';

interface RoleDefinition {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  desc: string;
}

const ROLE_OPTIONS: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Admin Bandara Mozes Kilangin',
    badge: 'Mozes Kilangin',
    icon: Building2,
    desc: 'Kelola permohonan sewa hanggar, apron, ruangan, dan fasilitas Bandara Mozes Kilangin'
  },
  {
    id: 'admin_mini_airport',
    name: 'Admin Mini Airport',
    badge: 'Mini Airport',
    icon: Plane,
    desc: 'Kelola permohonan operasional & slot pendaratan perintis jaringan Mini Airport Papua Tengah'
  },
  {
    id: 'superadmin',
    name: 'Super Admin',
    badge: 'Super Admin',
    icon: ShieldAlert,
    desc: 'Kontrol penuh seluruh modul sistem, hak akses, dan manajemen pengguna'
  },
  {
    id: 'dinas',
    name: 'Dinas Perhubungan',
    badge: 'Dinas',
    icon: Landmark,
    desc: 'Verifikasi legalitas mitra penyewa, penerbitan tagihan SKRD, dan monitoring PAD'
  },
  {
    id: 'kepala dinas',
    name: 'Kepala Dinas',
    badge: 'Eksekutif',
    icon: Briefcase,
    desc: 'Persetujuan eksekutif kontrak, PKS payung, dan ikhtisar pendapatan daerah'
  },
  {
    id: 'petugas',
    name: 'Petugas Lapangan Mozes Kilangin',
    badge: 'Petugas Mozes',
    icon: ClipboardCheck,
    desc: 'Pencatatan log fisik hanggar & apron, verifikasi jadwal armada, dan Laporan Tutup Hari Bandara Mozes Kilangin'
  },
  {
    id: 'petugas_mini_airport',
    name: 'Petugas Lapangan Mini Airport',
    badge: 'Petugas Mini Airport',
    icon: TowerControl,
    desc: 'Pencatatan realisasi fisik pendaratan, alokasi stand 01/02, jumlah pax, dan inap/parkir di airstrip Mini Airport'
  },
  {
    id: 'tenant',
    name: 'Mitra Maskapai / Tenant',
    badge: 'Mitra Tenant',
    icon: Building2,
    desc: 'Pengajuan permohonan sewa, permohonan izin operasional mini airport, dan monitoring tagihan retribusi'
  }
];

export default function SuperAdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [airportOptions, setAirportOptions] = useState<AirportOptionsData>({
    all_options: [],
    main_airports: [],
    mini_airports: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin',
    airportCategory: 'none' as 'none' | 'main' | 'mini',
    selectedAirportId: '' as string
  });

  // Delete Dialog State
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersData, airportsData] = await Promise.all([
        userService.getUsers(),
        userService.getAirportOptions()
      ]);
      setUsers(usersData);
      setAirportOptions(airportsData);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal memuat data pengguna';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setEditingUserId(null);
    setShowPassword(false);
    setFormData({
      username: '',
      password: '',
      role: 'admin',
      airportCategory: 'main',
      selectedAirportId: airportOptions.main_airports[0]?.id ? String(airportOptions.main_airports[0].id) : ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserAccount) => {
    setIsEditMode(true);
    setEditingUserId(user.id);
    setShowPassword(false);

    let category: 'none' | 'main' | 'mini' = 'none';
    let airportIdStr = '';

    const roleLower = (user.role || '').toLowerCase();
    if (user.mini_airport_id || roleLower === 'admin_mini_airport' || roleLower === 'petugas_mini_airport' || roleLower === 'petugas lapangan mini airport') {
      category = 'mini';
      airportIdStr = user.mini_airport_id ? String(user.mini_airport_id) : (airportOptions.mini_airports[0]?.id ? String(airportOptions.mini_airports[0].id) : '');
    } else if (user.airport_id || roleLower === 'admin' || roleLower === 'petugas' || roleLower === 'petugas lapangan') {
      category = 'main';
      airportIdStr = user.airport_id ? String(user.airport_id) : (airportOptions.main_airports[0]?.id ? String(airportOptions.main_airports[0].id) : '');
    }

    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      airportCategory: category,
      selectedAirportId: airportIdStr
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error('Username akun wajib diisi');
      return;
    }

    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    if (isEditMode && formData.password && formData.password.length < 6) {
      toast.error('Password baru minimal 6 karakter jika ingin diubah');
      return;
    }

    // Determine airport assignment based on role and selection
    let airport_type: 'main' | 'mini' | 'none' = 'none';
    let airport_id: number | null = null;
    let mini_airport_id: number | null = null;

    if (formData.role === 'admin_mini_airport' || formData.role === 'petugas_mini_airport') {
      airport_type = 'mini';
      mini_airport_id = formData.selectedAirportId 
        ? Number.parseInt(formData.selectedAirportId, 10) 
        : (airportOptions.mini_airports[0]?.id || null);
    } else if (formData.role === 'admin' || formData.role === 'petugas' || formData.role === 'petugas lapangan') {
      airport_type = 'main';
      airport_id = formData.selectedAirportId 
        ? Number.parseInt(formData.selectedAirportId, 10) 
        : (airportOptions.main_airports[0]?.id || 1);
    } else if (formData.airportCategory === 'main' && formData.selectedAirportId) {
      airport_type = 'main';
      airport_id = Number.parseInt(formData.selectedAirportId, 10);
    } else if (formData.airportCategory === 'mini' && formData.selectedAirportId) {
      airport_type = 'mini';
      mini_airport_id = Number.parseInt(formData.selectedAirportId, 10);
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && editingUserId) {
        await userService.updateUser(editingUserId, {
          username: formData.username.trim(),
          role: formData.role,
          password: formData.password ? formData.password : undefined,
          airport_type,
          airport_id,
          mini_airport_id
        });
        toast.success(`Akun "${formData.username}" berhasil diperbarui!`);
      } else {
        await userService.createUser({
          username: formData.username.trim(),
          password: formData.password,
          role: formData.role,
          airport_type,
          airport_id,
          mini_airport_id
        });
        toast.success(`Akun baru "${formData.username}" berhasil ditambahkan!`);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Gagal menyimpan akun pengguna');
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setIsDeleting(true);
    try {
      await userService.deleteUser(deleteConfirmUser.id);
      toast.success(`Akun "${deleteConfirmUser.username}" berhasil dihapus`);
      setDeleteConfirmUser(null);
      await loadData();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Gagal menghapus akun pengguna');
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const airportName = u.airport?.nama_bandara || '';
    const airportKode = u.airport?.kode_bandara || '';
    const matchSearch = 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airportKode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const roleLower = u.role.toLowerCase();
    let matchRole = false;
    if (selectedRole === 'ALL') {
      matchRole = true;
    } else if (selectedRole === 'petugas') {
      matchRole = roleLower === 'petugas' || roleLower === 'petugas lapangan';
    } else if (selectedRole === 'petugas_mini_airport') {
      matchRole = roleLower === 'petugas_mini_airport' || roleLower === 'petugas lapangan mini airport';
    } else {
      matchRole = roleLower === selectedRole.toLowerCase();
    }
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'superadmin':
      case 'super admin':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#dd4b39] text-white rounded">SUPER ADMIN</span>;
      case 'admin':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#3c8dbc] text-white rounded inline-flex items-center gap-1">
            <Building2 className="w-3 h-3 text-white" /> ADMIN MOZES KILANGIN
          </span>
        );
      case 'admin_mini_airport':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#f39c12] text-white rounded inline-flex items-center gap-1">
            <Plane className="w-3 h-3 text-white" /> ADMIN MINI AIRPORT
          </span>
        );
      case 'dinas':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#605ca8] text-white rounded">DINAS</span>;
      case 'kepala dinas':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#453678] text-white rounded">KEPALA DINAS</span>;
      case 'petugas':
      case 'petugas lapangan':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#00a65a] text-white rounded inline-flex items-center gap-1">
            <ClipboardCheck className="w-3 h-3 text-white" /> PETUGAS MOZES KILANGIN
          </span>
        );
      case 'petugas_mini_airport':
      case 'petugas lapangan mini airport':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#00c0ef] text-white rounded inline-flex items-center gap-1">
            <TowerControl className="w-3 h-3 text-white" /> PETUGAS MINI AIRPORT
          </span>
        );
      case 'tenant':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-slate-700 text-white rounded">MITRA TENANT</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-slate-600 text-white rounded">{role.toUpperCase()}</span>;
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4 font-sans">
      {/* Header Halaman (Konsisten dengan Standar MARS Admin) */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[20px] font-normal text-[#333] uppercase flex items-center gap-2">
            Manajemen Akun Pengguna
          </h1>
          <p className="text-[12px] text-[#777] mt-0.5">
            Kelola Kredensial, Hak Akses Peran Sistem, dan Penempatan Bandara (Bandara Mozes Kilangin &amp; Mini Airport)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="Refresh Data"
            className="p-1.5 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs rounded-none flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3c8dbc]" /> Refresh
          </button>
          <div className="text-[12px] text-[#777] items-center bg-white border border-[#e0e0e0] px-3 py-1.5 shadow-2xs hidden sm:flex">
            <span className="mr-1">Super Admin Portal</span> / <span className="ml-1 font-bold text-slate-800">Manajemen Akun</span>
          </div>
        </div>
      </header>

      {/* Baris 1: 4 KPI Cards (Konsisten Warna & Layout Sesuai Standar MARS / AdminLTE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Akun Pengguna */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] flex-shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div className="p-3.5 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider truncate">Total Akun Terdaftar</span>
            <span className="text-[20px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {users.length} Akun
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1 truncate">
              Database Aktif Sistem MARS
            </span>
          </div>
        </div>

        {/* KPI 2: Super Administrator */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] flex-shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="p-3.5 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider truncate">Super Administrator</span>
            <span className="text-[20px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {users.filter(u => u.role === 'superadmin' || u.role === 'super admin').length} Akun
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1 truncate">
              Otoritas Kontrol Penuh Pusat
            </span>
          </div>
        </div>

        {/* KPI 3: Administrator Bandara */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] flex-shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="p-3.5 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider truncate">Admin Bandara (Mozes &amp; Mini)</span>
            <span className="text-[20px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {users.filter(u => u.role === 'admin' || u.role === 'admin_mini_airport').length} Akun
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1 truncate">
              Mozes: {users.filter(u => u.role === 'admin').length} • Mini: {users.filter(u => u.role === 'admin_mini_airport').length}
            </span>
          </div>
        </div>

        {/* KPI 4: Petugas Lapangan (Mozes & Mini Airport) */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex items-stretch">
          <div className="w-[75px] bg-slate-50 border-r border-[#f4f4f4] flex items-center justify-center text-[#3c8dbc] flex-shrink-0">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div className="p-3.5 flex flex-col justify-center flex-1 min-w-0">
            <span className="uppercase text-[11px] text-[#777] font-bold tracking-wider truncate">Petugas Lapangan (Mozes &amp; Mini)</span>
            <span className="text-[20px] font-bold text-[#333] font-mono leading-tight mt-0.5">
              {users.filter(u => ['petugas', 'petugas lapangan', 'petugas_mini_airport', 'petugas lapangan mini airport'].includes(u.role.toLowerCase())).length} Akun
            </span>
            <span className="text-[11px] text-[#3c8dbc] font-bold mt-1 truncate">
              Mozes: {users.filter(u => ['petugas', 'petugas lapangan'].includes(u.role.toLowerCase())).length} • Mini: {users.filter(u => ['petugas_mini_airport', 'petugas lapangan mini airport'].includes(u.role.toLowerCase())).length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Box (Tabel Daftar Akun) */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex flex-col">
        {/* Controls Toolbar */}
        <div className="p-3 border-b border-[#f4f4f4] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenCreateModal}
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Akun Baru</span>
            </button>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-[#d2d6de] px-3 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:border-[#3c8dbc]"
            >
              <option value="ALL">Semua Role Pengguna</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin Bandara Mozes Kilangin</option>
              <option value="admin_mini_airport">Admin Mini Airport</option>
              <option value="dinas">Dinas Perhubungan</option>
              <option value="kepala dinas">Kepala Dinas</option>
              <option value="petugas">Petugas Lapangan Mozes Kilangin</option>
              <option value="petugas_mini_airport">Petugas Lapangan Mini Airport</option>
              <option value="tenant">Mitra Tenant</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Cari username, role, bandara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-xs focus:outline-none focus:border-[#3c8dbc] w-full sm:w-[260px]"
              />
              <button className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors">
                <Search className="w-3.5 h-3.5 text-[#777]" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc] mb-2" />
              <span className="text-xs">Memuat data pengguna...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#f4f4f4] bg-[#f9fafb] text-[#555] uppercase text-[11px] font-semibold">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Role Akses</th>
                  <th className="py-3 px-4">Penempatan Bandara</th>
                  <th className="py-3 px-4">Tanggal Dibuat</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      Tidak ada akun pengguna yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-800 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs uppercase">
                          {item.username.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <span>{item.username}</span>
                            {currentUser?.username === item.username && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-[#3c8dbc] border border-blue-200 font-bold">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 font-normal">ID: USR-{String(item.id).padStart(4, '0')}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getRoleBadge(item.role)}
                      </td>
                      <td className="py-3 px-4">
                        {item.airport ? (
                          <div className="flex items-center gap-1.5">
                            {item.airport.type === 'mini' ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                                <Plane className="w-3 h-3 text-amber-600" /> Mini Airport
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-[#3c8dbc] border border-blue-200 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-[#3c8dbc]" /> Bandara Utama
                              </span>
                            )}
                            <span className="font-medium text-gray-700">
                              {item.airport.nama_bandara} ({item.airport.kode_bandara})
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">
                            Semua Bandara / Kantor Pusat
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Akun & Hak Akses"
                            className="px-2.5 py-1 bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-[#3c8dbc]" />
                            <span>Edit</span>
                          </button>
                          
                          {item.username !== 'super_admin' && currentUser?.username !== item.username && (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmUser(item)}
                              title="Hapus Akun"
                              className="px-2.5 py-1 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#f4f4f4] bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
          <span>Menampilkan {filteredUsers.length} dari {users.length} akun</span>
          <span className="text-[11px] text-gray-400">Hak Akses Penuh Super Administrator</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL TAMBAH & EDIT AKUN (KONSISTEN WARNA & LAYOUT MARS)                  */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            role="dialog"
            aria-modal="true"
            className="bg-white w-full max-w-2xl border-t-[3px] border-[#3c8dbc] shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-white border-b border-[#f4f4f4] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none bg-blue-50 text-[#3c8dbc] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#333] flex items-center gap-2">
                    {isEditMode ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
                  </h3>
                  <p className="text-[11px] text-[#777]">
                    {isEditMode 
                      ? `Perbarui informasi akun @${formData.username}`
                      : 'Kredensial, penugasan peran, dan unit penempatan bandara'
                    }
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleCloseModal} 
                disabled={isSubmitting}
                className="text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-5 space-y-5 max-h-[calc(85vh-130px)] overflow-y-auto">
                
                {/* SECTION 1: Kredensial Akun */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#3c8dbc]">
                    <span className="w-4 h-4 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center text-[10px] font-bold border border-blue-200">1</span>
                    <span>Informasi Kredensial Akun</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Username */}
                    <div>
                      <label className="block text-xs font-bold text-[#555] mb-1">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="contoh: admin_timika, petugas_ilaga"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full pl-8 pr-3 py-1.5 text-xs text-[#333] bg-white border border-[#d2d6de] focus:outline-none focus:border-[#3c8dbc] transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Username autentikasi unik sistem MARS.</p>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-bold text-[#555] mb-1 flex justify-between items-center">
                        <span>Password {isEditMode ? <span className="text-slate-400 font-normal">(Opsional)</span> : <span className="text-red-500">*</span>}</span>
                        {isEditMode && <span className="text-[10px] text-slate-400 font-normal">Kosongkan bila tidak diubah</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required={!isEditMode}
                          placeholder={isEditMode ? 'Ketik password baru' : 'Minimal 6 karakter'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-8 pr-8 py-1.5 text-xs text-[#333] bg-white border border-[#d2d6de] focus:outline-none focus:border-[#3c8dbc] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Terenkripsi aman dengan Bcrypt (salt 10 rounds).</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Role Hak Akses (Konsisten Layout & Card Styling) */}
                <div className="space-y-3 pt-3 border-t border-[#f4f4f4]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#3c8dbc]">
                      <span className="w-4 h-4 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center text-[10px] font-bold border border-blue-200">2</span>
                      <span>Pilih Peran &amp; Hak Akses (Role) <span className="text-red-500">*</span></span>
                    </div>
                    <span className="text-[11px] font-bold text-[#3c8dbc]">
                      Aktif: {ROLE_OPTIONS.find(r => r.id === formData.role)?.name || formData.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {ROLE_OPTIONS.map((role) => {
                      const IconComponent = role.icon;
                      const isSelected = formData.role === role.id;

                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            if (role.id === 'admin' || role.id === 'petugas') {
                              const defaultMain = airportOptions.main_airports[0]?.id ? String(airportOptions.main_airports[0].id) : '';
                              setFormData({
                                ...formData,
                                role: role.id,
                                airportCategory: 'main',
                                selectedAirportId: formData.airportCategory === 'main' && formData.selectedAirportId ? formData.selectedAirportId : defaultMain
                              });
                            } else if (role.id === 'admin_mini_airport' || role.id === 'petugas_mini_airport') {
                              const defaultMini = airportOptions.mini_airports[0]?.id ? String(airportOptions.mini_airports[0].id) : '';
                              setFormData({
                                ...formData,
                                role: role.id,
                                airportCategory: 'mini',
                                selectedAirportId: formData.airportCategory === 'mini' && formData.selectedAirportId ? formData.selectedAirportId : defaultMini
                              });
                            } else {
                              setFormData({ ...formData, role: role.id });
                            }
                          }}
                          className={`relative text-left p-3 border transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected 
                              ? 'border-[#3c8dbc] bg-blue-50/50 shadow-xs' 
                              : 'border-[#d2d6de] bg-white hover:border-[#3c8dbc]/50 hover:bg-slate-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <div className={`w-7 h-7 flex items-center justify-center ${
                                isSelected ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                              {isSelected ? (
                                <span className="w-4 h-4 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center text-[9px]">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-50 text-slate-600 border border-slate-200">
                                  {role.badge}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-[#333]">{role.name}</h4>
                            <p className="text-[10.5px] text-[#777] leading-tight mt-1 line-clamp-2">
                              {role.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 3: Penempatan Bandara (airports vs mini_airports) */}
                <div className="space-y-3 pt-3 border-t border-[#f4f4f4]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#3c8dbc]">
                      <span className="w-4 h-4 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center text-[10px] font-bold border border-blue-200">3</span>
                      <span>Penempatan Wilayah / Bandara</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Tabel: airports &amp; mini_airports
                    </span>
                  </div>

                  {/* Category Pill Switcher (Konsisten Warna Brand #3c8dbc) */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 border border-[#e0e0e0]">
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        airportCategory: 'none', 
                        selectedAirportId: '' 
                      })}
                      className={`py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        formData.airportCategory === 'none'
                          ? 'bg-white text-[#3c8dbc] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Semua Bandara / Pusat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const firstMain = airportOptions.main_airports[0]?.id ? String(airportOptions.main_airports[0].id) : '';
                        setFormData({ 
                          ...formData, 
                          airportCategory: 'main', 
                          selectedAirportId: firstMain 
                        });
                      }}
                      className={`py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        formData.airportCategory === 'main'
                          ? 'bg-white text-[#3c8dbc] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Bandara Utama ({airportOptions.main_airports?.length || 0})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const firstMini = airportOptions.mini_airports[0]?.id ? String(airportOptions.mini_airports[0].id) : '';
                        setFormData({ 
                          ...formData, 
                          airportCategory: 'mini', 
                          selectedAirportId: firstMini 
                        });
                      }}
                      className={`py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        formData.airportCategory === 'mini'
                          ? 'bg-white text-[#3c8dbc] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>Mini Airport ({airportOptions.mini_airports?.length || 0})</span>
                    </button>
                  </div>

                  {/* Airport Options Content */}
                  {formData.airportCategory === 'none' && (
                    <div className="p-3 bg-slate-50 border border-[#e0e0e0] text-xs text-slate-600 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800">Cakupan Wilayah Pusat / Lintas Bandara</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Akun tidak dibatasi pada satu bandara tertentu. Direkomendasikan untuk <span className="font-semibold text-slate-700">Super Administrator</span>, <span className="font-semibold text-slate-700">Kepala Dinas</span>, atau staf kantor pusat Dishub.
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.airportCategory === 'main' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2">
                        {airportOptions.main_airports?.map((airport) => {
                          const isSelected = String(airport.id) === formData.selectedAirportId;
                          return (
                            <button
                              key={`main-${airport.id}`}
                              type="button"
                              onClick={() => setFormData({ ...formData, selectedAirportId: String(airport.id) })}
                              className={`p-3 border text-left flex items-center justify-between transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-[#3c8dbc] bg-blue-50/50 shadow-xs' 
                                  : 'border-[#d2d6de] bg-white hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-50 text-[#3c8dbc] font-bold font-mono flex items-center justify-center text-xs border border-blue-200">
                                  {airport.kode_bandara}
                                </div>
                                <div>
                                  <div className="font-bold text-xs text-slate-900">{airport.nama_bandara}</div>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    <span>{airport.lokasi || 'Timika, Papua Tengah'}</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#3c8dbc] border border-blue-200">
                                Bandara Utama
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {formData.airportCategory === 'mini' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {airportOptions.mini_airports?.map((mini) => {
                          const isSelected = String(mini.id) === formData.selectedAirportId;
                          return (
                            <button
                              key={`mini-${mini.id}`}
                              type="button"
                              onClick={() => setFormData({ ...formData, selectedAirportId: String(mini.id) })}
                              className={`p-3 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-[#3c8dbc] bg-blue-50/50 shadow-xs' 
                                  : 'border-[#d2d6de] bg-white hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1 mb-2">
                                <div className="w-8 h-8 bg-amber-50 text-amber-800 font-bold font-mono flex items-center justify-center text-xs border border-amber-200">
                                  {mini.kode_bandara}
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200">
                                  Mini Airport
                                </span>
                              </div>
                              <div>
                                <div className="font-bold text-xs text-slate-900 line-clamp-1">{mini.nama_bandara}</div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                  <span className="truncate">{mini.lokasi || 'Papua Tengah'}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-[#fcfcfc] px-5 py-3 border-t border-[#f4f4f4] flex items-center justify-between">
                <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kredensial tersimpan dengan standar keamanan hash SHA/Bcrypt</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="px-3.5 py-1.5 border border-[#d2d6de] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isEditMode ? 'Simpan Perubahan' : 'Buat Akun'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG (KONSISTEN FLAT STYLE)                         */}
      {/* ========================================================================= */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div 
            role="alertdialog"
            aria-modal="true"
            className="bg-white w-full max-w-md border-t-[3px] border-[#dd4b39] shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-red-50 text-[#dd4b39] flex items-center justify-center flex-shrink-0 border border-red-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">Hapus Akun Pengguna?</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus akun <span className="font-bold text-slate-900">@{deleteConfirmUser.username}</span> ({deleteConfirmUser.role})?
                </p>
                <div className="mt-2.5 p-2 bg-red-50/70 border border-red-200 text-[11px] text-red-700 leading-tight">
                  Tindakan ini permanen dan akan menghapus akses akun dari sistem MARS.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#f4f4f4] mt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 border border-[#d2d6de] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-1.5 bg-[#dd4b39] hover:bg-[#c9302c] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Ya, Hapus Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
