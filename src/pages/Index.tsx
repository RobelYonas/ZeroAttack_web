import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import PacketForm from '@/components/PacketForm';
import DetectionResult from '@/components/DetectionResult';
import PacketVisualizer from '@/components/PacketVisualizer';
import ModelUploader from '@/components/ModelUploader';
import { PacketData, DetectionResult as DetectionResultType } from '@/lib/types';
import { analyzePacket } from '@/lib/mockApi';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPacket, setCurrentPacket] = useState<PacketData | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResultType | null>(null);

  const handlePacketSubmit = async (packet: PacketData) => {
    setIsLoading(true);
    setCurrentPacket(packet);
    setDetectionResult(null);
    
    try {
      const result = await analyzePacket(packet);
      setDetectionResult(result);
      toast({
        title: "Analysis Complete",
        description: `Packet analyzed as ${result.status}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze packet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Packet Detection System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Configure and analyze network packets for suspicious activity
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Upload Your Model</h2>
          <p className="text-gray-600 mb-4">
            Before analyzing packets, you need to upload a .keras model file that will be used for detection.
          </p>
          <ModelUploader />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Analyze Packets</h2>
          <PacketForm onSubmit={handlePacketSubmit} isLoading={isLoading} />
          
          {currentPacket && (
            <PacketVisualizer packet={currentPacket} isLoading={isLoading} />
          )}
          
          {detectionResult && (
            <DetectionResult result={detectionResult} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;