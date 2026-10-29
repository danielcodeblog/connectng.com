"use client";
import React from "react";
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";

export const sampleMarkers: GlobeMarker[] = [
  { lat: 40.7128, lng: -74.006, label: "New York" },
  { lat: 51.5074, lng: -0.1278, label: "London" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, label: "Sydney" },
  { lat: 6.5244, lng: 3.3792, label: "Lagos" },
  { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
  { lat: 48.8566, lng: 2.3522, label: "Paris" },
  { lat: 28.6139, lng: 77.209, label: "New Delhi" },
  { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
  { lat: 37.5665, lng: 126.978, label: "Seoul" },
  { lat: -26.2041, lng: 28.0473, label: "Johannesburg" },
  { lat: 52.52, lng: 13.405, label: "Berlin" },
  { lat: 22.3193, lng: 114.1694, label: "Hong Kong" },
  { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
];

export default function Globe3DDemo() {
  return (
    <div className="h-screen w-full bg-white">
      <Globe3D
        className="h-full w-full"
        markers={sampleMarkers}
        config={{
          backgroundColor: "#ffffff",
          atmosphereColor: "#38bdf8",
          atmosphereIntensity: 0.8,
          bumpScale: 3,
          autoRotateSpeed: 0.35,
          showAtmosphere: true,
          radius: 2.1,
          showWireframe: true,
          wireframeColor: "#e2e8f0",
        }}
        onMarkerClick={(marker) => {
          console.log("Clicked marker:", marker.label);
        }}
        onMarkerHover={(marker) => {
          if (marker) {
            console.log("Hovering:", marker.label);
          }
        }}
      />
    </div>
  );
}
