export interface Patient {
  id: string;
  patientName: string;
  phone: string;
  source: "manual" | "website";
  sessionId: string;
  createdAt: string;
}
