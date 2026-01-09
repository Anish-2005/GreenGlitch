import type { Metadata } from "next";

import { DashboardScreen } from "@/components/dashboard/DashboardScreen";

export const metadata: Metadata = {
  title: "Heatmap Dashboard • GreenGlitch",
  description: "Monitor real-time civic cleanliness hotspots across your community.",
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
