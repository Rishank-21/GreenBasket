
'use client'
import React, { useEffect, useState } from 'react'

import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
 import "leaflet/dist/leaflet.css";
 import { OpenStreetMapProvider } from "leaflet-geosearch";

 const markerIcon = new L.Icon({
   iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
   iconSize: [40, 40],
   iconAnchor: [20, 40],
 });

 type props={
    position:[number, number] | null,
    setPosition:(pos:[number, number])=>void
 }
const CheckoutMap = ({ position, setPosition }: props) => {

    const DraggableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression, 15, { animate: true });
    }, [position, map]);
    return (
      <Marker
        icon={markerIcon}
        position={position as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      />
    );
  };


  return (
    <MapContainer
                  center={position as LatLngExpression}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker />
                </MapContainer>
  )
}

export default CheckoutMap
