"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { AlertTriangle, Compass, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { subscribeToReports } from "@/lib/firebase/reports";
import { DEFAULT_COORDINATES, SEVERITY_BADGES, TAGLINE } from "@/lib/constants";
import type { CivicReport } from "@/lib/types";
import { formatTimestamp, severityToWeight } from "@/lib/utils";

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

type HeatmapTuple = [number, number, number];

function HeatmapOverlay({ points }: { points: HeatmapTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) {
      return;
    }

    const heatmap = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      minOpacity: 0.25,
      gradient: {
        0.1: "#22c55e",
        0.5: "#eab308",
        0.9: "#dc2626",
      },
    });

    heatmap.addTo(map);

    return () => {
      heatmap.remove();
    };
  }, [map, points]);

  return null;
}

export function HeatmapPanel() {
  const [reports, setReports] = useState<CivicReport[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToReports(setReports, (error) => {
      console.error("Firestore subscription failed", error);
    });
    return () => unsubscribe();
  }, []);

  const heatmapPoints = useMemo<HeatmapTuple[]>(() => {
    return reports.map((report) => [report.lat, report.lng, severityToWeight(report.severity)]);
  }, [reports]);

  const mapCenter: [number, number] = [DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng];

  return (
    <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-xl">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom
          style={{ height: 480, width: "100%" }}
          className="h-full w-full"
        >
          <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
          <HeatmapOverlay points={heatmapPoints} />
        </MapContainer>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/80 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Live Feed</p>
          <h3 className="text-2xl font-semibold text-slate-900">Civic Hotspots</h3>
          <p className="text-sm text-slate-600">{TAGLINE}</p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white">
          <AlertTriangle className="h-5 w-5 text-amber-300" />
          <div>
            <p className="font-semibold">{reports.length || "No"} reports</p>
            <p className="text-xs text-slate-300">Updated in real time via Firestore</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {reports.slice(0, 6).map((report) => (
            <article key={report.id} className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {report.lat.toFixed(3)}, {report.lng.toFixed(3)}
                </div>
                <Badge label={report.severity} className={SEVERITY_BADGES[report.severity]} />
              </div>
              <p className="mt-2 text-base font-semibold text-slate-900">{report.category}</p>
              <p className="text-sm text-slate-600">{report.description}</p>
              <div className="mt-2 text-xs text-slate-400">{formatTimestamp(report.createdAt)}</div>
            </article>
          ))}
          {!reports.length && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center text-sm text-slate-500">
              <Compass className="h-6 w-6" />
              <p>Heatmap will light up once the first report is filed.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
