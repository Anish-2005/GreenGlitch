import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type FirestoreError,
} from "firebase/firestore";

import { db } from "./client";
import type { CivicReport, SeverityLevel } from "../types";
import { severityToWeight } from "../utils";

const COLLECTION = process.env.NEXT_PUBLIC_FIRESTORE_COLLECTION ?? "reports";

export interface SaveReportPayload {
  lat: number;
  lng: number;
  category: CivicReport["category"];
  severity: SeverityLevel;
  description: string;
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
}

export async function saveReport(payload: SaveReportPayload) {
  const metadata = payload;
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...metadata,
    imageUrl: null,
    status: "open",
    createdAt: Date.now(),
    createdAtServer: serverTimestamp(),
    weight: severityToWeight(metadata.severity),
  });

  return { id: docRef.id };
}

export function subscribeToReports(
  onData: (reports: CivicReport[]) => void,
  onError?: (error: FirestoreError) => void,
) {
  const q = query(collection(db, COLLECTION), orderBy("createdAtServer", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const next = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          lat: data.lat,
          lng: data.lng,
          category: data.category,
          severity: data.severity,
          description: data.description,
          imageUrl: data.imageUrl,
          status: data.status ?? "open",
          createdAt:
            typeof data.createdAt === "number"
              ? data.createdAt
              : data.createdAt?.toMillis?.() ?? Date.now(),
        } satisfies CivicReport;
      });
      onData(next);
    },
    (error) => onError?.(error),
  );
}

export function subscribeToUserReports(
  userId: string,
  onData: (reports: CivicReport[]) => void,
  onError?: (error: FirestoreError) => void,
) {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAtServer", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const next = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          lat: data.lat,
          lng: data.lng,
          category: data.category,
          severity: data.severity,
          description: data.description,
          imageUrl: data.imageUrl,
          status: data.status ?? "open",
          createdAt:
            typeof data.createdAt === "number"
              ? data.createdAt
              : data.createdAt?.toMillis?.() ?? Date.now(),
        } satisfies CivicReport;
      });
      onData(next);
    },
    (error) => onError?.(error),
  );
}
