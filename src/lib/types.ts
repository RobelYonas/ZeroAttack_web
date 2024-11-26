export interface PacketData {
  anomalyScore: number;
  responseTime: number;
  dataTransferRate: number;
  errorCode: number;
  numberOfPackets: number;
  threatLevel: 'Benign' | 'Zero-Day Attack';
  protocol: 'TCP' | 'UDP';
  eventDescription: 'Connection Attempt' | 'Suspicious Activity';
}

export interface DetectionResult {
  status: 'normal' | 'suspicious';
  confidence: number;
  timestamp: string;
}