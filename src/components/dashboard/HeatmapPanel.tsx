"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { AlertTriangle, Compass, MapPin, Activity, Radio, ShieldAlert, Clock, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { subscribeToReports } from "@/lib/firebase/reports";
import { DEFAULT_COORDINATES, SEVERITY_BADGES, TAGLINE } from "@/lib/constants";
import type { CivicReport } from "@/lib/types";
import { formatTimestamp, severityToWeight } from "@/lib/utils";

import { useTheme } from "@/components/ui/ThemeProvider";

// High-end Adaptive Theme Tiles
const DARK_MAP_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const LIGHT_MAP_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const MAP_ATTRIBUTION = '&copy; <a href="https://carto.com/attributions">CARTO</a>';

const HEATMAP_GRADIENT = {
  0.2: "#10b981", // Emerald
  0.5: "#0ea5e9", // Sky
  0.8: "#6366f1", // Indigo
  1.0: "#f43f5e", // Rose (Critical)
};

const severityDotColor: Record<CivicReport["severity"], string> = {
  High: "#f43f5e",
  Medium: "#0ea5e9",
  Low: "#10b981",
};

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

type HeatmapTuple = [number, number, number];

function HeatmapOverlay({ points, reports }: { points: HeatmapTuple[]; reports: CivicReport[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const layers: L.Layer[] = [];

    if (points.length) {
      const heatmap = (L as any).heatLayer(points, {
        radius: 35,
        blur: 25,
        maxZoom: 18,
        minOpacity: 0.3,
        gradient: HEATMAP_GRADIENT,
      });
      heatmap.addTo(map);
      layers.push(heatmap);
    }

    if (reports.length) {
      const dotGroup = L.layerGroup();
      reports.forEach((report) => {
        L.circleMarker([report.lat, report.lng], {
          radius: 5,
          color: severityDotColor[report.severity],
          weight: 2,
          fillColor: "#ffffff",
          fillOpacity: 0.8,
          opacity: 1,
        })
          .bindTooltip(`<div class="font-black text-[10px] uppercase tracking-widest">${report.category}</div>`, {
            offset: L.point(0, -10),
            direction: "top",
            opacity: 0.9,
            className: "custom-tooltip",
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
  const { theme } = useTheme();
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
    <section className="grid gap-12 lg:grid-cols-[1.8fr,1fr] items-start">
      {/* Left: Map Visualization */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-[0.4em]">
              <Activity className="h-3 w-3 animate-pulse" />
              Lattice Heat Vision
            </div>
            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter">ANALYTIC <span className="text-gradient">ZONES.</span></h3>
          </div>

          <div className="flex gap-4">
            <div className="glass px-6 py-4 rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-2">Events</span>
              <span className="text-2xl font-black italic">{totalReports}</span>
            </div>
            <div className="glass px-6 py-4 rounded-2xl border border-white/5 bg-rose-500/5 flex flex-col items-center min-w-[120px]">
              <span className="text-xs font-black text-rose-500/50 uppercase tracking-widest leading-none mb-2">Critical</span>
              <span className="text-2xl font-black italic text-rose-500">{highCount}</span>
            </div>
          </div>
        </div>

        <div className="relative group p-1 glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
          {/* Internal Scifi HUD elements */}
          <div className="absolute inset-0 pointer-events-none z-10 border-[20px] border-transparent">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30" />
          </div>

          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom
            attributionControl={false}
            className="h-[350px] sm:h-[450px] lg:h-[600px] w-full rounded-[2.2rem] grayscale-[0.2] contrast-[1.1]"
          >
            <TileLayer url={theme === "dark" ? DARK_MAP_URL : LIGHT_MAP_URL} />
            <HeatmapOverlay points={heatmapPoints} reports={reports} />
          </MapContainer>


          {/* Map Legend Hud */}
          <div className="absolute bottom-6 left-6 z-[600] flex flex-wrap gap-3 pointer-events-none">
            <div className="glass bg-black/40 border border-white/5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-500 blur-[2px]" /> Danger Zone
            </div>
            <div className="glass bg-black/40 border border-white/5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white" /> Exact Node
            </div>
          </div>
        </div>
      </div>

      {/* Right: Detailed Feed */}
      <div className="space-y-8">
        <div className="px-2">
          <div className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-3">
            <ShieldAlert className="h-3.5 w-3.5" />
            Intelligence Stream
          </div>
          <h3 className="text-3xl font-black italic tracking-tighter">INCIDENT <br /><span className="text-gradient">CHRONICLE.</span></h3>
        </div>

        {/* Featured: Latest Signal Feed */}
        <AnimatePresence>
          {latestReport && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass bg-primary/5 border border-primary/20 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group mb-4"
            >
              <div className="absolute top-0 right-0 p-4">
                <Radio className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">Raw Signal Feed</span>
                <h4 className="text-2xl font-black italic tracking-tight uppercase">{latestReport.category}</h4>
                <div className="flex items-center gap-3 text-muted-foreground text-[10px] font-bold">
                  <Clock className="h-4 w-4" />
                  {formatTimestamp(latestReport.createdAt)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {reports.map((report, i) => (
            <motion.article
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={report.id}
              className="relative group glass bg-card/20 hover:bg-card/40 border border-white/5 hover:border-primary/30 p-6 rounded-[2rem] transition-all duration-500 shadow-xl overflow-hidden"
            >
              {/* Card Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 rounded-lg bg-secondary/50 border border-border/50 text-[8px] font-black tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  {report.lat.toFixed(4)} / {report.lng.toFixed(4)}
                </div>
                <Badge label={report.severity} className={`${SEVERITY_BADGES[report.severity]} !rounded-full !px-4 !py-1 !text-[9px] !font-black !tracking-widest`} />
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="text-lg font-black tracking-tight uppercase group-hover:text-primary transition-colors italic">{report.category}</h4>
                <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed line-clamp-2">{report.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-bold text-muted-foreground/50 italic">{formatTimestamp(report.createdAt)}</span>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                  Detail <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.article>
          ))}

          {!reports.length && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 px-8 rounded-[3rem] border border-dashed border-white/10 bg-white/5 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Compass className="h-8 w-8 text-primary animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest">Scanning Grid...</p>
                <p className="text-[10px] font-medium text-muted-foreground italic">Establishing baseline for urban friction signals.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
