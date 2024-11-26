import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetectionResult as DetectionResultType } from '@/lib/types';
import { Shield, ShieldAlert } from 'lucide-react';

interface DetectionResultProps {
  result: DetectionResultType;
}

const DetectionResult = ({ result }: DetectionResultProps) => {
  const isNormal = result.status === 'normal';
  
  return (
    <Card className={`w-full max-w-2xl transition-colors ${
      isNormal ? 'bg-green-50' : 'bg-amber-50'
    }`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          {isNormal ? (
            <>
              <Shield className="w-6 h-6 text-status-normal" />
              <span className="text-status-normal">Normal Traffic</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-6 h-6 text-status-suspicious" />
              <span className="text-status-suspicious">Suspicious Activity</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Timestamp:</span>
            <span className="font-mono text-sm">
              {new Date(result.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionResult;