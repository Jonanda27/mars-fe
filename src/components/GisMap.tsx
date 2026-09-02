"use client";

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Asset } from '@/types/asset';
import { useGisStore } from '@/store/useGisStore';

// Fix for default Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface GisMapProps {
  assets: Asset[];
}

export default function GisMap({ assets }: GisMapProps) {
  // Center of Mozes Kilangin Airport (approx)
  const mapCenter: [number, number] = [-4.529, 136.886];
  const { setSelectedAsset, openPanel, closePanelsToTheRight } = useGisStore();

  const getAssetColor = (asset: Asset) => {
    let status = asset.status || 'Available';
    
    if (asset.contracts && asset.contracts.length > 0) {
      const activeContract = asset.contracts.find(c => c.status === 'Active' || c.status === 'Approved');
      if (activeContract) status = 'Occupied';
    }

    switch (status.toLowerCase()) {
      case 'available':
      case 'tersedia':
        return '#22c55e'; // Green 500
      case 'occupied':
      case 'disewa':
      case 'rented':
        return '#2563eb'; // Blue 600
      case 'expiring':
        return '#facc15'; // Yellow 400
      case 'maintenance':
      case 'problem':
        return '#dc2626'; // Red 600
      default:
        return '#94a3b8'; // Slate 400
    }
  };

  return (
    <div className="w-full h-full bg-slate-900">
      <MapContainer 
        center={mapCenter} 
        zoom={16} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false} // Disable default zoom control to not overlap with our UI
      >
        {/* You can change to a satellite tile layer here if desired */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Zoom control positioned manually */}
        <div className="leaflet-top leaflet-right mt-20 mr-4">
            <div className="leaflet-control-zoom leaflet-bar leaflet-control">
                <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">+</a>
                <a className="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out">−</a>
            </div>
        </div>
        
        {assets.map((asset) => {
          if (!asset.koordinat_gis) return null;
          
          const coordsMatch = asset.koordinat_gis.split(',');
          if (coordsMatch.length !== 2) return null;
          
          const lat = parseFloat(coordsMatch[0].trim());
          const lng = parseFloat(coordsMatch[1].trim());
          if (isNaN(lat) || isNaN(lng)) return null;

          const color = getAssetColor(asset);

          return (
            <CircleMarker 
              key={asset.id} 
              center={[lat, lng]} 
              pathOptions={{ fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.9 }}
              radius={12}
              eventHandlers={{
                click: () => {
                  closePanelsToTheRight(-1);
                  setSelectedAsset(asset);
                  openPanel('detail-aset', `Detail Aset: ${asset.kode_aset}`);
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">
                <div className="font-bold text-xs">{asset.kode_aset}</div>
                <div className="text-[10px]">{asset.nama_aset}</div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
