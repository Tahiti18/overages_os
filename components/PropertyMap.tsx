
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Property } from '../types';
import { MapPinIcon, DollarSignIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyMapProps {
  properties: Property[];
}

const PropertyMap: React.FC<PropertyMapProps> = ({ properties }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  // Simulated coordinates for mock data (In prod, these would be in the DB)
  const coords: Record<string, [number, number]> = {
    '1': [33.7490, -84.3880], // Atlanta
    '2': [25.7907, -80.1300], // Miami Beach
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([33.0, -82.0], 5);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add Markers
    properties.forEach((prop) => {
      const pos = coords[prop.id] || [33.7490 + Math.random(), -84.3880 + Math.random()];
      
      const isHighValue = prop.surplus_amount > 200000;
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative flex items-center justify-center">
            ${isHighValue ? '<div class="marker-pulse"></div>' : ''}
            <div class="marker-pin" style="background: ${isHighValue ? '#f59e0b' : '#4f46e5'}"></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const marker = L.marker(pos, { icon }).addTo(mapRef.current!);
      
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 min-w-[240px] font-sans';
      popupContent.innerHTML = `
        <div class="space-y-3">
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property Address</p>
            <p class="text-sm font-bold text-slate-800">${prop.address}</p>
          </div>
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Surplus</p>
              <p class="text-sm font-bold text-indigo-600">$${prop.surplus_amount.toLocaleString()}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deadline</p>
              <p class="text-xs font-semibold text-slate-700">${prop.deadline_date}</p>
            </div>
          </div>
          <button id="view-case-${prop.id}" class="w-full mt-2 bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            Open Case File <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-case-${prop.id}`);
        btn?.addEventListener('click', (e) => {
          e.preventDefault();
          navigate(`/properties/${prop.id}`);
        });
      });
    });

    if (properties.length > 0) {
      const group = L.featureGroup(Object.values(mapRef.current._layers).filter(l => l instanceof L.Marker) as L.Marker[]);
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    }

  }, [properties, navigate]);

  return (
    <div className="relative w-full h-[600px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Legend Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg space-y-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Heatmap Legend</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div>
            <span className="text-xs font-medium text-slate-700">High-Value ($200k+)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            <span className="text-xs font-medium text-slate-700">Standard Case</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
