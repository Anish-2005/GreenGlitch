import type { Metadata } from "next";

import { ReportScreen } from "@/components/report/ReportScreen";

export const metadata: Metadata = {
  title: "Report an Issue • GreenGlitch",
  description: "Capture, auto-tag, and publish civic maintenance issues in seconds.",
};

export default function ReportPage() {
  return <ReportScreen />;
}
