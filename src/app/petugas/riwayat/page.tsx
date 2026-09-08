"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Search, MapPin, Eye } from 'lucide-react';
import api from '@/services/api';
import dayjs from 'dayjs';

export default function RiwayatPencatatanPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistoryLogs();
  }, []);

  const fetchHistoryLogs = async () => {
    try {
      // Assuming api.get('/logs') returns all logs. We filter out those with exit_time !== null
      const res = await api.get('/logs');
      const allLogs = res.data.data || [];
      // Filter only finished logs
      const finishedLogs = allLogs.filter((log: any) => log.exit_time !== null);
      // Sort by exit_time descending
      finishedLogs.sort((a: any, b: any) => new Date(b.exit_time).getTime() - new Date(a.exit_time).getTime());
      
      setLogs(finishedLogs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.tenants?.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Pencatatan (Check-Out)</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border-t-4 border-[#3c8dbc]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Daftar Pesawat Keluar</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari Registrasi / Tenant..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Tail Number</th>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Waktu Masuk</th>
                <th className="px-4 py-3">Waktu Keluar</th>
                <th className="px-4 py-3">Catatan</th>
                <th className="px-4 py-3">Status Tagihan</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                    Memuat data riwayat...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada riwayat pencatatan pesawat.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-bold text-gray-800">{log.registration_number}</td>
                    <td className="px-4 py-3">{log.tenants?.nama_perusahaan || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {log.parking_location || 'Hanggar'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{dayjs(log.entry_time).format('DD MMM YYYY HH:mm')}</td>
                    <td className="px-4 py-3">{dayjs(log.exit_time).format('DD MMM YYYY HH:mm')}</td>
                    <td className="px-4 py-3">
                      {log.notes ? (
                        <span className="text-xs text-gray-600 italic bg-gray-100 p-1 rounded inline-block max-w-[150px] truncate" title={log.notes}>
                          {log.notes}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {log.billing_status === 'Unbilled' ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Menunggu Tagihan</span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Sudah Ditagih</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
