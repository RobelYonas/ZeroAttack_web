import { PacketData } from '@/lib/types';

interface PacketVisualizerProps {
  packet: PacketData;
  isLoading: boolean;
}

const PacketVisualizer = ({ packet, isLoading }: PacketVisualizerProps) => {
  return (
    <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-sm">
      <div className={`grid grid-cols-2 gap-4 ${isLoading ? 'animate-pulse' : ''}`}>
        <div className="space-y-2">
          <div className="font-mono text-sm text-gray-600">Anomaly Score</div>
          <div className="font-semibold">{packet.anomalyScore}</div>
        </div>
        <div className="space-y-2">
          <div className="font-mono text-sm text-gray-600">Response Time</div>
          <div className="font-semibold">{packet.responseTime} ms</div>
        </div>
        <div className="space-y-2">
          <div className="font-mono text-sm text-gray-600">Transfer Rate</div>
          <div className="font-semibold">{packet.dataTransferRate} MB/s</div>
        </div>
        <div className="space-y-2">
          <div className="font-mono text-sm text-gray-600">Error Code</div>
          <div className="font-semibold">{packet.errorCode}</div>
        </div>
        <div className="space-y-2">
          <div className="font-mono text-sm text-gray-600">Packets</div>
          <div className="font-semibold">{packet.numberOfPackets}</div>
        </div>
        <div className="space-y-2">
          <div className="font-mono text-sm text-gray-600">Protocol</div>
          <div className="font-semibold">{packet.protocol}</div>
        </div>
        <div className="space-y-2">
          <div className="font-mono text-sm text-gray-600">Threat Level</div>
          <div className="font-semibold">{packet.threatLevel}</div>
        </div>
        <div className="space-y-2">
          <div className="font-mono text-sm text-gray-600">Event</div>
          <div className="font-semibold">{packet.eventDescription}</div>
        </div>
      </div>
    </div>
  );
};

export default PacketVisualizer;