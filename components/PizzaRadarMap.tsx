'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface Pizzeria {
  id: string
  name: string
  address: string
  city: string
  state: string | null
  latitude: string | null
  longitude: string | null
  acceptsBitcoin: boolean
  acceptsLightning: boolean
  treasurySlicesAvailable: number
  verified: boolean
}

interface PizzaRadarMapProps {
  pizzerias: Pizzeria[]
  center?: [number, number]
  zoom?: number
}

export function PizzaRadarMap({
  pizzerias,
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 12
}: PizzaRadarMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter pizzerias with valid coordinates
  const validPizzerias = pizzerias.filter(
    p => p.latitude && p.longitude
  )

  // Calculate center if pizzerias available
  const mapCenter: [number, number] = validPizzerias.length > 0
    ? [
        parseFloat(validPizzerias[0].latitude!),
        parseFloat(validPizzerias[0].longitude!)
      ]
    : center

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>
    )
  }

  if (validPizzerias.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-2xl font-bold mb-2">No Pizzerias Mapped</h3>
          <p className="text-gray-400">
            No pizzerias with GPS coordinates found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-gray-800">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validPizzerias.map((pizzeria) => (
          <Marker
            key={pizzeria.id}
            position={[
              parseFloat(pizzeria.latitude!),
              parseFloat(pizzeria.longitude!)
            ]}
            icon={icon}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[250px]">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  {pizzeria.name}
                  {pizzeria.verified && (
                    <span className="text-green-500 text-sm">✓</span>
                  )}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                  {pizzeria.city}{pizzeria.state && `, ${pizzeria.state}`}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {pizzeria.acceptsBitcoin && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded">
                      ₿ Bitcoin
                    </span>
                  )}
                  {pizzeria.acceptsLightning && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs font-bold rounded">
                      ⚡ Lightning
                    </span>
                  )}
                  {pizzeria.treasurySlicesAvailable > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-bold rounded">
                      {pizzeria.treasurySlicesAvailable} Free Slices
                    </span>
                  )}
                </div>

                <a
                  href={`/pizza-bank/pizzeria/${pizzeria.id}`}
                  className="block w-full px-4 py-2 bg-orange-500 text-white font-bold text-center rounded hover:bg-orange-600 transition-colors text-sm"
                >
                  View Details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
