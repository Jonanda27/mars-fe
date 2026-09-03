"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu, Video, CreditCard, Play, RotateCcw, Activity, CheckCircle2,
  Database, Send, Terminal, Smartphone, ShieldCheck, Check
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface SimulatedSession {
  id: string;
  plate: string;
  type: 'Roda 2' | 'Roda 4' | 'VIP';
  entryTime: Date;
  tariff: number;
}

interface MqttLog {
  id: string;
  topic: string;
  payload: string;
  time: string;
}

export default function IoTParkingSimulationPage() {
  const { user } = useAuthStore();

  // --- STATE GERBANG MASUK (GATE IN) ---
  const [barrierIn, setBarrierIn] = useState<'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'>('CLOSED');
  const [anprIn, setAnprIn] = useState<string>('');
  const [loopIn, setLoopIn] = useState<boolean>(false);

  // --- STATE GERBANG KELUAR (GATE OUT) ---
  const [barrierOut, setBarrierOut] = useState<'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'>('CLOSED');
  const [anprOut, setAnprOut] = useState<string>('');
  const [loopOut, setLoopOut] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'READING' | 'SUCCESS'>('IDLE');
  const [activeExitSession, setActiveExitSession] = useState<SimulatedSession | null>(null);

  // --- STATE DATA DAN LOG SINKRONISASI ---
  const [parkedVehicles, setParkedVehicles] = useState<SimulatedSession[]>([
    { id: 'S-701', plate: 'PA 5510 MR', type: 'Roda 4', entryTime: new Date(Date.now() - 3600000 * 2), tariff: 5000 },
    { id: 'S-702', plate: 'PA 2441 KK', type: 'Roda 2', entryTime: new Date(Date.now() - 3600000 * 5), tariff: 2000 },
    { id: 'S-703', plate: 'PA 8899 VP', type: 'VIP', entryTime: new Date(Date.now() - 3600000 * 1), tariff: 25000 },
  ]);
  const [mqttLogs, setMqttLogs] = useState<MqttLog[]>([]);
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(145000);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const pushMqttLog = (topic: string, payload: any) => {
    const timeString = new Date().toLocaleTimeString('id-ID', { hour12: false });
    const newLog: MqttLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      topic,
      payload: JSON.stringify(payload, null, 2),
      time: timeString
    };
    setMqttLogs(prev => [newLog, ...prev].slice(0, 15));
  };

  // --- SIMULASI MOBIL MASUK (GATE IN SEQUENCE) ---
  const triggerGateInSimulation = () => {
    if (loopIn || barrierIn !== 'CLOSED') return;

    const randomPlates = ['PA 8821 MM', 'PA 3144 KK', 'PA 9011 XX', 'PA 1289 YY', 'PA 7741 AB'];
    const selectedPlate = randomPlates[Math.floor(Math.random() * randomPlates.length)];
    const types: ('Roda 2' | 'Roda 4' | 'VIP')[] = ['Roda 4', 'Roda 2', 'VIP'];
    const selectedType = types[Math.floor(Math.random() * types.length)];

    // Step 1: Mobil menginjak loop detektor masuk
    setLoopIn(true);
    pushMqttLog('gate/tim/entry/loop', { sensor_state: 'HIGH', event: 'VEHICLE_DETECTED' });

    // Step 2: Kamera ANPR membaca plat nomor (1 detik)
    setTimeout(() => {
      setAnprIn(selectedPlate);
      pushMqttLog('gate/tim/entry/anpr', { camera_id: 'CCTV-TIM-IN-1', detected_plate: selectedPlate, confidence: 0.98 });
    }, 1000);

    // Step 3: Edge Gateway membuat sesi & membuka palang (2.5 detik)
    setTimeout(() => {
      setBarrierIn('OPENING');
      pushMqttLog('gate/tim/entry/session_created', {
        session_id: `S-${Date.now().toString().slice(-4)}`,
        plate: selectedPlate,
        vehicle_type: selectedType,
        timestamp: new Date().toISOString()
      });

      setTimeout(() => setBarrierIn('OPEN'), 500);
    }, 2500);

    // Step 4: Mobil melewati gerbang, sensor LOW, palang menutup (5.5 detik)
    setTimeout(() => {
      setLoopIn(false);
      setBarrierIn('CLOSING');
      pushMqttLog('gate/tim/entry/loop', { sensor_state: 'LOW', event: 'VEHICLE_PASSED' });

      const newSession: SimulatedSession = {
        id: `S-${Date.now().toString().slice(-4)}`,
        plate: selectedPlate,
        type: selectedType,
        entryTime: new Date(),
        tariff: selectedType === 'Roda 2' ? 2000 : selectedType === 'Roda 4' ? 5000 : 25000
      };
      setParkedVehicles(prev => [newSession, ...prev]);

      setTimeout(() => {
        setBarrierIn('CLOSED');
        setAnprIn('');
      }, 500);
    }, 5500);
  };

  // --- SIMULASI MOBIL KELUAR (GATE OUT SEQUENCE) ---
  const triggerGateOutSimulation = (session: SimulatedSession) => {
    if (loopOut || barrierOut !== 'CLOSED') return;

    setActiveExitSession(session);
    setLoopOut(true);
    setAnprOut(session.plate);
    pushMqttLog('gate/tim/exit/loop', { sensor_state: 'HIGH', event: 'VEHICLE_DETECTED' });
    pushMqttLog('gate/tim/exit/anpr', { camera_id: 'CCTV-TIM-OUT-1', detected_plate: session.plate, confidence: 0.99 });

    // Step 2: Loket membaca durasi & tarif (1.5 detik)
    setTimeout(() => {
      setPaymentStatus('READING');
      pushMqttLog('gate/tim/exit/billing_request', {
        session_id: session.id,
        duration_minutes: Math.ceil((Date.now() - session.entryTime.getTime()) / 60000),
        amount_due: session.tariff
      });
    }, 1500);

    // Step 3: Pengendara Tap E-Money / Lunas (4 detik)
    setTimeout(() => {
      setPaymentStatus('SUCCESS');
      setBarrierOut('OPENING');
      setSimulatedRevenue(prev => prev + session.tariff);
      pushMqttLog('payment/tim/emoney/tap', {
        card_uid: 'E-PAPUA-8812491',
        amount_paid: session.tariff,
        reference_no: `REF-${Date.now().toString().slice(-6)}`,
        status: 'SUCCESS'
      });

      setTimeout(() => setBarrierOut('OPEN'), 500);
    }, 4000);

    // Step 4: Mobil melintas, palang menutup kembali (7.5 detik)
    setTimeout(() => {
      setLoopOut(false);
      setBarrierOut('CLOSING');
      setPaymentStatus('IDLE');
      pushMqttLog('gate/tim/exit/loop', { sensor_state: 'LOW', event: 'VEHICLE_PASSED' });

      setParkedVehicles(prev => prev.filter(v => v.id !== session.id));
      setActiveExitSession(null);

      setTimeout(() => {
        setBarrierOut('CLOSED');
        setAnprOut('');
      }, 500);
    }, 7500);
  };

  const resetSimulation = () => {
    setMqttLogs([]);
    setParkedVehicles([
      { id: 'S-701', plate: 'PA 5510 MR', type: 'Roda 4', entryTime: new Date(Date.now() - 3600000 * 2), tariff: 5000 },
      { id: 'S-702', plate: 'PA 2441 KK', type: 'Roda 2', entryTime: new Date(Date.now() - 3600000 * 5), tariff: 2000 },
      { id: 'S-703', plate: 'PA 8899 VP', type: 'VIP', entryTime: new Date(Date.now() - 3600000 * 1), tariff: 25000 },
    ]);
    setSimulatedRevenue(145000);
    setBarrierIn('CLOSED');
    setBarrierOut('CLOSED');
    setLoopIn(false);
    setLoopOut(false);
    setPaymentStatus('IDLE');
    setAnprIn('');
    setAnprOut('');
    setActiveExitSession(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#ecf0f5] min-h-full flex flex-col gap-5 text-slate-800 font-sans">
      
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-900 tracking-tight">
              Simulasi IoT Smart Parking (Fase 2)
            </h1>
          </div>
          <p className="text-[12px] text-slate-500 mt-1">
            Demonstrasi Palang Otomatis, Sensor Deteksi Logam, Kamera ANPR &amp; Transmisi Telemetri MQTT Luring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded border border-slate-200">
            UPBU: {user?.airport_id === 2 ? 'Sentani (DJJ)' : 'Mozes Kilangin (TIM)'}
          </span>
          <button
            onClick={resetSimulation}
            className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Reset Data Simulasi"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Grid Utama: Konsol Gerbang + Feed MQTT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Kolom Kiri & Tengah: Terminal Gerbang Masuk & Keluar + Tabel Kendaraan */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          
          {/* Gerbang Masuk (Gate In) & Gerbang Keluar (Gate Out) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* TERMINAL GERBANG MASUK */}
            <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Terminal Masuk (Gate In)</span>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${loopIn ? 'bg-blue-600 animate-ping' : 'bg-slate-300'}`} title={loopIn ? 'Sensor Mendeteksi Mobil' : 'Sensor Kosong'} />
                </div>

                {/* CCTV Kamera Box */}
                <div className="flex gap-3 items-stretch mb-3">
                  <div className="flex-1 bg-slate-950 h-28 rounded relative flex items-center justify-center overflow-hidden border border-slate-800">
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-slate-300 font-bold uppercase tracking-widest">CCTV IN-1</span>
                    </div>
                    {anprIn ? (
                      <div className="text-center z-10 animate-in zoom-in-95">
                        <div className="font-mono text-white text-[17px] font-bold bg-black/80 px-3 py-1 rounded border border-white/20 tracking-wider">
                          {anprIn}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase mt-1 block">ANPR Matched (98%)</span>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 text-[11px]">
                        <Video className="w-5 h-5 mx-auto mb-1 text-slate-600 animate-pulse" />
                        Menunggu Kendaraan...
                      </div>
                    )}
                  </div>

                  {/* Palang In Status Box */}
                  <div className="w-24 bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-center items-center text-center shrink-0">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Palang</span>
                    <span className={`text-[11px] font-bold mt-1.5 px-2 py-0.5 rounded uppercase tracking-wider w-full ${
                      barrierIn === 'CLOSED' ? 'bg-rose-100 text-rose-700' :
                      barrierIn === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                    }`}>
                      {barrierIn}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Sensor Loop: <strong className="text-slate-700">{loopIn ? 'ON' : 'OFF'}</strong></span>
                <button
                  onClick={triggerGateInSimulation}
                  disabled={loopIn || barrierIn !== 'CLOSED'}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[12px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-3.5 h-3.5" /> Mobil Masuk
                </button>
              </div>
            </div>

            {/* TERMINAL GERBANG KELUAR */}
            <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Terminal Keluar (Gate Out)</span>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${loopOut ? 'bg-emerald-600 animate-ping' : 'bg-slate-300'}`} title={loopOut ? 'Sensor Mendeteksi Mobil' : 'Sensor Kosong'} />
                </div>

                {/* CCTV & Tapping Status Box */}
                <div className="flex gap-3 items-stretch mb-3">
                  <div className="flex-1 bg-slate-950 h-28 rounded relative flex flex-col items-center justify-center p-2 border border-slate-800">
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-slate-300 font-bold uppercase tracking-widest">CCTV OUT-1</span>
                    </div>
                    {activeExitSession ? (
                      <div className="text-center z-10">
                        <div className="font-mono text-white text-[15px] font-bold bg-black/80 px-2.5 py-0.5 rounded border border-white/20 mb-1 inline-block">
                          {anprOut}
                        </div>
                        {paymentStatus === 'READING' && (
                          <div className="animate-pulse">
                            <span className="text-[10px] text-amber-300 font-semibold uppercase block">Tap Kartu E-Money</span>
                            <span className="text-[14px] font-bold text-white font-mono">Rp {activeExitSession.tariff.toLocaleString('id-ID')}</span>
                          </div>
                        )}
                        {paymentStatus === 'SUCCESS' && (
                          <div className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-[11px] uppercase tracking-wider">Lunas &amp; Buka!</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 text-[11px]">
                        <Smartphone className="w-5 h-5 mx-auto mb-1 text-slate-600" />
                        Menunggu Sesi Keluar
                      </div>
                    )}
                  </div>

                  {/* Palang Out Status Box */}
                  <div className="w-24 bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-center items-center text-center shrink-0">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Palang</span>
                    <span className={`text-[11px] font-bold mt-1.5 px-2 py-0.5 rounded uppercase tracking-wider w-full ${
                      barrierOut === 'CLOSED' ? 'bg-rose-100 text-rose-700' :
                      barrierOut === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                    }`}>
                      {barrierOut}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Metode: <strong className="text-slate-700">Tap E-Money Luring</strong></span>
                <span className="text-slate-400 italic">Pemicu: Tabel di bawah</span>
              </div>
            </div>

          </div>

          {/* TABEL KENDARAAN PARKIR DI DALAM BANDARA */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-700" />
                <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">
                  Kendaraan Terparkir di Dalam Bandara ({parkedVehicles.length} Unit)
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 font-mono">Sinkronisasi Real-Time</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-4">Plat Nomor (ANPR)</th>
                    <th className="py-2.5 px-4">Tipe Kendaraan</th>
                    <th className="py-2.5 px-4">Waktu Masuk</th>
                    <th className="py-2.5 px-4 text-right">Tarif Akrual</th>
                    <th className="py-2.5 px-4 text-center">Aksi Keluar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parkedVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-[13px]">
                        Area parkir bandara kosong. Klik tombol "Mobil Masuk" di atas untuk memulai simulasi.
                      </td>
                    </tr>
                  ) : (
                    parkedVehicles.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{v.plate}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{v.type}</td>
                        <td className="py-3 px-4 text-slate-500 text-[12px]">
                          {v.entryTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIT
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                          Rp {v.tariff.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => triggerGateOutSimulation(v)}
                            disabled={loopOut || barrierOut !== 'CLOSED'}
                            title="Simulasikan Kendaraan Tap Kartu Keluar"
                            className="w-8 h-8 rounded border border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-colors mx-auto shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Terminal MQTT & Akrual Pendapatan */}
        <div className="flex flex-col gap-5">
          
          {/* TERMINAL TELEMETRI MQTT LURING */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-md text-slate-200 flex flex-col min-h-[440px]">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-950 flex justify-between items-center rounded-t-lg">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-[12px] font-bold text-slate-300 uppercase tracking-wider">MQTT Edge Broker Feed</span>
              </div>
              <button
                onClick={() => setMqttLogs([])}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Bersihkan Log Terminal"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>

            <div 
              ref={logContainerRef}
              className="p-3.5 flex-1 font-mono text-[11px] overflow-y-auto flex flex-col gap-2.5 max-h-[380px]"
            >
              {mqttLogs.length === 0 ? (
                <div className="text-slate-500 text-center italic py-16 text-[12px]">
                  Menunggu transmisi telemetri perangkat keras...<br />
                  Jalankan mobil masuk/keluar untuk memicu payload JSON.
                </div>
              ) : (
                mqttLogs.map(log => (
                  <div key={log.id} className="border-b border-slate-800/80 pb-2.5 last:border-0">
                    <div className="flex justify-between text-emerald-400 text-[10px] font-bold mb-1">
                      <span>[{log.time}] {log.topic}</span>
                    </div>
                    <pre className="text-slate-300 bg-black/50 p-2 rounded text-[10px] overflow-x-auto leading-relaxed">
                      {log.payload}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AKRUAL KEUANGAN REAL-TIME */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">
                Akrual Pendapatan (Simulasi Demo)
              </h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-md border border-slate-200 flex justify-between items-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Kas Masuk Demo</span>
              <span className="text-[22px] font-bold font-mono text-emerald-700">
                Rp {simulatedRevenue.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic mt-2 text-center">
              *Angka bertambah otomatis setiap kali transaksi Tap E-Money sukses di gerbang keluar.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
