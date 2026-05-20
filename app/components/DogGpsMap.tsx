"use client";

import { useEffect, useState } from "react";
import { MapContainer, Polyline, Popup, CircleMarker, TileLayer } from "react-leaflet";

type DogGpsMapProps = {
  title: string;
};

const EARTH_RADIUS_METERS = 6378137;

function offsetCoordinate(latitude: number, longitude: number, distanceMeters: number) {
  const bearing = Math.PI / 4;
  const latitudeRadians = (latitude * Math.PI) / 180;
  const longitudeRadians = (longitude * Math.PI) / 180;
  const angularDistance = distanceMeters / EARTH_RADIUS_METERS;

  const nextLatitude = Math.asin(
    Math.sin(latitudeRadians) * Math.cos(angularDistance) +
      Math.cos(latitudeRadians) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const nextLongitude =
    longitudeRadians +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitudeRadians),
      Math.cos(angularDistance) - Math.sin(latitudeRadians) * Math.sin(nextLatitude),
    );

  return [
    (nextLatitude * 180) / Math.PI,
    ((nextLongitude * 180) / Math.PI + 540) % 360 - 180,
  ] as const;
}

function formatCoordinate(value: number) {
  return value.toFixed(5);
}

export default function DogGpsMap({ title }: DogGpsMapProps) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
        setLocationError(null);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Activa el acceso a tu ubicación para ver el mapa.");
          return;
        }

        setLocationError("No se pudo obtener tu ubicación.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  const devicePosition = userPosition ? offsetCoordinate(userPosition[0], userPosition[1], 5) : null;
  const center = userPosition ?? ([0, 0] as const);
  const mapKey = userPosition ? `${userPosition[0]}-${userPosition[1]}` : "gps-map-empty";

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-border bg-white shadow-[0_12px_28px_rgba(11,27,40,0.07)]">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">GPS</p>
          <h3 className="mt-1 text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand">
          {userPosition ? "Ubicación del usuario" : "Solicitando ubicación"}
        </span>
      </div>

      {userPosition && devicePosition ? (
        <MapContainer key={mapKey} center={center} zoom={18} scrollWheelZoom={false} className="h-64 w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CircleMarker center={center} radius={7} pathOptions={{ color: "#1c6e8c", fillColor: "#1c6e8c", fillOpacity: 0.9 }}>
            <Popup>Tu ubicación</Popup>
          </CircleMarker>

          <CircleMarker
            center={devicePosition}
            radius={7}
            pathOptions={{ color: "#8a5a34", fillColor: "#8a5a34", fillOpacity: 0.95 }}
          >
            <Popup>Perro a 5 m</Popup>
          </CircleMarker>

          <Polyline positions={[center, devicePosition]} pathOptions={{ color: "#66727d", weight: 3, dashArray: "6 6" }} />
        </MapContainer>
      ) : (
        <div className="grid h-64 place-items-center px-4 text-center text-sm text-muted">
          <div className="space-y-2">
            <p>{locationError ?? "Solicitando acceso a tu ubicación..."}</p>
            {userPosition ? <p>Lat {formatCoordinate(userPosition[0])}, Lng {formatCoordinate(userPosition[1])}</p> : null}
          </div>
        </div>
      )}
    </div>
  );
}