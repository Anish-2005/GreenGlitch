"use client";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const DashboardScreen = dynamic(
  () => import("@/components/dashboard/DashboardScreen").then((mod) => mod.DashboardScreen),
  {
    ssr: false,
    loading: () => <div className="min-h-[60vh] w-full bg-slate-950" aria-label="Loading dashboard" />,
  },
);


export default function DashboardPage() {
  return <DashboardScreen />;
}
