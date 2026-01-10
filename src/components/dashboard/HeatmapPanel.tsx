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
const HEATMAP_GRADIENT = {
  0.2: "#fca5a5",
  0.5: "#fb7185",
  0.8: "#f43f5e",
  1: "#be123c",
};

const severityDotColor: Record<CivicReport["severity"], string> = {
  High: "#f43f5e",
  Medium: "#fb923c",
  Low: "#4ade80",
};

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});
L.Marker.prototype.options.icon = DefaultIcon;

type HeatmapTuple = [number, number, number];

function HeatmapOverlay({ points, reports }: { points: HeatmapTuple[]; reports: CivicReport[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    const layers: L.Layer[] = [];

    if (points.length) {
      const heatmap = L.heatLayer(points, {
        radius: 45,
        blur: 35,
        maxZoom: 18,
        minOpacity: 0.15,
        gradient: HEATMAP_GRADIENT,
      });
      heatmap.addTo(map);
      layers.push(heatmap);
    }

    if (reports.length) {
      const dotGroup = L.layerGroup();
      reports.forEach((report) => {
        L.circleMarker([report.lat, report.lng], {
          radius: 6,
          color: severityDotColor[report.severity],
          weight: 2,
          fillColor: "#ffffff",
          fillOpacity: 0.65,
          opacity: 0.9,
        })
          .bindTooltip(`${report.category} · ${report.severity}`, {
            offset: L.point(0, -12),
            direction: "top",
            opacity: 0.85,
            sticky: true,
          })
          .addTo(dotGroup);
      });
      dotGroup.addTo(map);
      layers.push(dotGroup);
    }

    return () => {
      layers.forEach((layer) => map.removeLayer(layer));
    };
  }, [map, points, reports]);

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

  const totalReports = reports.length;
  const highCount = reports.filter((report) => report.severity === "High").length;
  const latestReport = reports[0];

  return (
    <section className="grid gap-8 lg:grid-cols-[1.7fr,1.1fr]">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/15 via-slate-950 to-slate-950 p-5 shadow-[0_40px_90px_-45px_rgba(244,63,94,0.9)] sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200">Heat Vision</p>
            <h3 className="text-3xl font-semibold text-white">Live Civic Hotzones</h3>
            <p className="text-sm text-slate-300">{TAGLINE}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center min-w-[140px]">
              <p className="text-2xl font-semibold text-white">{totalReports || "0"}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Reports</p>
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center min-w-[140px]">
              <p className="text-2xl font-semibold text-rose-200">{highCount}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">High Alert</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/80">
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom
            style={{ width: "100%" }}
            className="h-[320px] w-full sm:h-[420px] lg:h-[520px]"
          >
            <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
            <HeatmapOverlay points={heatmapPoints} reports={reports} />
          </MapContainer>
          <div className="pointer-events-none absolute left-4 top-4 z-[600] w-full max-w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-4 backdrop-blur sm:left-6 sm:top-6 sm:max-w-xs sm:px-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-200">Latest Signal</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {latestReport ? latestReport.category : "Awaiting activity"}
            </p>
            <p className="text-[0.7rem] text-slate-200">
              {latestReport ? formatTimestamp(latestReport.createdAt) : "Feed idle"}
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 z-[600] flex w-full max-w-full flex-wrap gap-2 text-xs text-white sm:bottom-6 sm:left-6 sm:max-w-none sm:gap-3">
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1">
              <span className="h-3 w-3 rounded-full bg-rose-400" /> Hot area
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1">
              <span className="h-3 w-3 rounded-full border-2 border-rose-200 bg-white" /> Exact report
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Live Feed</p>
          <h3 className="text-2xl font-semibold text-white">Incident Timeline</h3>
          <p className="text-sm text-slate-300">Streaming directly from Firestore.</p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white">
          <AlertTriangle className="h-5 w-5 text-amber-300" />
          <div>
            <p className="font-semibold">{totalReports ? `${totalReports} active reports` : "No reports yet"}</p>
            <p className="text-xs text-slate-300">Auto-refreshing without reloads</p>
          </div>
        </div>
        <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1 sm:max-h-[520px] sm:pr-2">
          {reports.slice(0, 6).map((report) => (
            <article key={report.id} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-lg">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                  <MapPin className="h-4 w-4 text-rose-200" />
                  {report.lat.toFixed(3)}, {report.lng.toFixed(3)}
                </div>
                <Badge label={report.severity} className={SEVERITY_BADGES[report.severity]} />
              </div>
              <p className="mt-2 text-base font-semibold text-white">{report.category}</p>
              <p className="text-sm text-slate-200 break-words">{report.description}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>{formatTimestamp(report.createdAt)}</span>
                <span className="inline-flex items-center gap-1 text-rose-200">
                  <AlertTriangle className="h-3 w-3" /> {report.severity} severity
                </span>
              </div>
            </article>
          ))}
          {!reports.length && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-200">
              <Compass className="h-6 w-6 text-emerald-200" />
              <p>Heatmap will light up once the first report is filed.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
