"use client";

import React, { useState, useEffect } from 'react';
import { aircraftService } from '@/services/aircraftService';
import { Aircraft } from '@/types/aircraft';
import toast from 'react-hot-toast';
import { AircraftFormCard } from './components/AircraftFormCard';
import { AircraftFilterBar } from './components/AircraftFilterBar';
import { AircraftGridView } from './components/AircraftGridView';
import { AircraftListView } from './components/AircraftListView';

export default function DataPesawatPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [armadaList, setArmadaList] = useState<Aircraft[]>([]);
  const [aircraftTypes, setAircraftTypes] = useState<{id: number, jenis_pesawat: string, luas_efektif_m2: string}[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    registrasi: '',
    tipe: '',
    customTipe: '',
    customLuas: '',
    mtow: '',
    kapasitasPenumpang: '10',
    fotoPreview: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [data, types] = await Promise.all([
        aircraftService.getTenantAircrafts(),
        aircraftService.getMasterTypes()
      ]);
      setArmadaList(data);
      setAircraftTypes(types);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
      toast.error('Gagal memuat data armada pesawat');
    }
  };

  const handleResetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      registrasi: '',
      tipe: '',
      customTipe: '',
      customLuas: '',
      mtow: '',
      kapasitasPenumpang: '10',
      fotoPreview: ''
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, fotoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const buildAircraftPayload = (formData: {
  registrasi: string;
  tipe: string;
  customTipe: string;
  customLuas: string;
  mtow: string;
  kapasitasPenumpang: string;
  fotoPreview: string;
}) => {
  const isCustom = formData.tipe === 'Lainnya';
  return {
    registration_number: formData.registrasi.toUpperCase(),
    aircraft_type_id: isCustom ? undefined : Number(formData.tipe),
    custom_type_name: isCustom ? formData.customTipe : undefined,
    custom_type_area: isCustom ? formData.customLuas : undefined,
    mtow: Number(formData.mtow),
    capacity: Number(formData.kapasitasPenumpang),
    foto: formData.fotoPreview || undefined
  };
};

  const validateAircraftInput = () => {
    const isCustom = formData.tipe === 'Lainnya';
    const finalTipe = isCustom ? formData.customTipe : formData.tipe;
    if (!formData.registrasi || !finalTipe || !formData.mtow) return false;
    if (isCustom && !formData.customLuas) return false;
    return true;
  };

  const handleSubmitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!validateAircraftInput()) {
      toast.error("Mohon lengkapi Nomor Registrasi, Tipe Pesawat, Luas, dan Berat MTOW!");
      return;
    }

    const payload = buildAircraftPayload(formData);

    try {
      if (editingId) {
        const updatedPesawat = await aircraftService.updateTenantAircraft(editingId, payload);
        setArmadaList(prev => prev.map(item => item.id === editingId ? updatedPesawat : item));
        toast.success(`Data pesawat ${updatedPesawat.registration_number} berhasil diperbarui!`);
      } else {
        const newPesawat = await aircraftService.createTenantAircraft({
          ...payload,
          status: 'aktif',
          foto: payload.foto || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
        });
        setArmadaList(prev => [newPesawat, ...prev]);
        toast.success(`Pesawat ${newPesawat.registration_number} berhasil terdaftar di sistem!`);
      }

      handleResetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan pesawat');
    }
  };

  const handleEdit = (item: Aircraft) => {
    setEditingId(item.id!);
    
    const isCustomType = Boolean(item.custom_type_name || !aircraftTypes.some(t => t.id === item.aircraft_type_id));
    let tipeValue = 'Lainnya';
    if (!isCustomType && item.aircraft_type_id) {
      tipeValue = item.aircraft_type_id.toString();
    }
  
    setFormData({
      registrasi: item.registration_number,
      tipe: tipeValue,
      customTipe: isCustomType ? (item.aircraft_types?.jenis_pesawat || '') : '',
      customLuas: isCustomType ? (item.aircraft_types?.luas_efektif_m2?.toString() || '') : '',
      mtow: item.mtow ? item.mtow.toString() : '',
      kapasitasPenumpang: item.capacity ? item.capacity.toString() : '',
      fotoPreview: item.foto || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pesawat ini?')) return;
    try {
      await aircraftService.deleteTenantAircraft(id);
      setArmadaList(prev => prev.filter(item => item.id !== id));
      toast.success('Pesawat berhasil dihapus!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus pesawat');
    }
  };

  const filteredArmada = armadaList.filter(item => {
    const typeName = item.aircraft_types?.jenis_pesawat || '';
    const matchesSearch = item.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          typeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === 'hangar') {
      matchesCategory = !!item.asset_id;
    } else if (selectedCategory !== 'all') {
      matchesCategory = !item.asset_id && item.status === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
          Armada Pesawat <span className="text-[15px] font-light text-[#777] ml-2">Registrasi & Data</span>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium">Data Pesawat</span>
        </div>
      </header>

      {/* Form Input Pesawat Baru */}
      {showForm && (
        <AircraftFormCard
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          aircraftTypes={aircraftTypes}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleSubmitForm={handleSubmitForm}
          onCancel={handleResetForm}
        />
      )}

      {!showForm && (
        <>
          <AircraftFilterBar
            filteredArmadaCount={filteredArmada.length}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onAddNew={() => setShowForm(true)}
          />

          {viewMode === 'grid' ? (
            <AircraftGridView
              filteredArmada={filteredArmada}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <AircraftListView
              filteredArmada={filteredArmada}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}
