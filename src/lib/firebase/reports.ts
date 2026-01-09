import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type FirestoreError,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "./client";
import type { CivicReport, SeverityLevel } from "../types";
import { severityToWeight } from "../utils";

const COLLECTION = process.env.NEXT_PUBLIC_FIRESTORE_COLLECTION ?? "reports";
const STORAGE_FOLDER = process.env.NEXT_PUBLIC_STORAGE_FOLDER ?? "reports";

export interface SaveReportPayload {
  file: File;
  lat: number;
  lng: number;
  category: CivicReport["category"];
  severity: SeverityLevel;
  description: string;
}

export async function saveReport(payload: SaveReportPayload) {
  const { file, ...metadata } = payload;
  const sanitizedName = file.name.replace(/\s+/g, "-").toLowerCase();
  const path = `${STORAGE_FOLDER}/${Date.now()}-${sanitizedName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      category: metadata.category,
      severity: metadata.severity,
    },
  });

  const imageUrl = await getDownloadURL(snapshot.ref);
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...metadata,
    imageUrl,
    status: "open",
    createdAt: Date.now(),
    createdAtServer: serverTimestamp(),
    weight: severityToWeight(metadata.severity),
  });

  return { id: docRef.id, imageUrl };
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
