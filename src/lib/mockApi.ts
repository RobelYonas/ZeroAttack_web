import { PacketData, DetectionResult } from './types';
import { supabase } from '@/integrations/supabase/client';

const analyzeFallback = (packet: PacketData): DetectionResult => {
  // If event is suspicious or threat level is Zero-Day Attack, immediately return suspicious result
  if (packet.eventDescription === 'Suspicious Activity' || packet.threatLevel === 'Zero-Day Attack') {
    return {
      status: 'suspicious',
      confidence: 100,
      timestamp: new Date().toISOString()
    };
  }

  // Otherwise proceed with regular analysis
  let suspiciousScore = 0;
  let totalFactors = 0;

  // Anomaly score has highest weight (0-1 range)
  if (packet.anomalyScore > 0.7) {
    suspiciousScore += 30;
  } else if (packet.anomalyScore > 0.5) {
    suspiciousScore += 15;
  }
  totalFactors += 30;

  // Response time analysis (anything over 1000ms is suspicious)
  if (packet.responseTime > 1000) {
    suspiciousScore += 15;
  } else if (packet.responseTime > 500) {
    suspiciousScore += 7;
  }
  totalFactors += 15;

  // Data transfer rate analysis (unusually high rates are suspicious)
  if (packet.dataTransferRate > 100) {
    suspiciousScore += 10;
  } else if (packet.dataTransferRate > 50) {
    suspiciousScore += 5;
  }
  totalFactors += 10;

  // Error code analysis
  if (packet.errorCode !== 200) {
    suspiciousScore += 15;
  }
  totalFactors += 15;

  // Protocol analysis (UDP slightly more suspicious than TCP)
  if (packet.protocol === 'UDP') {
    suspiciousScore += 10;
  } else {
    suspiciousScore += 5;
  }
  totalFactors += 10;

  // Calculate final confidence percentage
  const confidence = Math.round((suspiciousScore / totalFactors) * 100);
  
  // Determine status based on confidence threshold
  const status = confidence > 60 ? 'suspicious' : 'normal';

  return {
    status,
    confidence,
    timestamp: new Date().toISOString()
  };
};

export const analyzePacket = async (packet: PacketData): Promise<DetectionResult> => {
  try {
    // Try to use the Supabase function first
    const { data, error } = await supabase.functions.invoke('analyze-packet', {
      body: { packet }
    });

    // If the Supabase function fails, use the fallback analysis
    if (error) {
      console.log('Using fallback analysis due to:', error.message);
      return analyzeFallback(packet);
    }

    return data;
  } catch (error) {
    console.log('Using fallback analysis due to:', error);
    return analyzeFallback(packet);
  }
};
