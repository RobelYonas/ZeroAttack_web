import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PacketData } from '@/lib/types';

interface PacketFormProps {
  onSubmit: (data: PacketData) => void;
  isLoading: boolean;
}

const PacketForm = ({ onSubmit, isLoading }: PacketFormProps) => {
  const [formData, setFormData] = useState<PacketData>({
    anomalyScore: 0,
    responseTime: 0,
    dataTransferRate: 0,
    errorCode: 200,
    numberOfPackets: 1,
    threatLevel: 'Benign',
    protocol: 'TCP',
    eventDescription: 'Connection Attempt'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Packet Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="anomalyScore">Anomaly Score (0-1)</Label>
              <Input
                id="anomalyScore"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.anomalyScore}
                onChange={(e) => setFormData({ ...formData, anomalyScore: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responseTime">Response Time (ms)</Label>
              <Input
                id="responseTime"
                type="number"
                step="0.1"
                min="0"
                value={formData.responseTime}
                onChange={(e) => setFormData({ ...formData, responseTime: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataTransferRate">Data Transfer Rate (MB/s)</Label>
              <Input
                id="dataTransferRate"
                type="number"
                step="0.1"
                min="0"
                value={formData.dataTransferRate}
                onChange={(e) => setFormData({ ...formData, dataTransferRate: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="errorCode">Error Code</Label>
              <Input
                id="errorCode"
                type="number"
                value={formData.errorCode}
                onChange={(e) => setFormData({ ...formData, errorCode: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfPackets">Number of Packets</Label>
              <Input
                id="numberOfPackets"
                type="number"
                min="1"
                value={formData.numberOfPackets}
                onChange={(e) => setFormData({ ...formData, numberOfPackets: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threatLevel">Threat Level</Label>
              <Select
                value={formData.threatLevel}
                onValueChange={(value: 'Benign' | 'Zero-Day Attack') => setFormData({ ...formData, threatLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select threat level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Benign">Benign</SelectItem>
                  <SelectItem value="Zero-Day Attack">Zero-Day Attack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protocol">Protocol</Label>
              <Select
                value={formData.protocol}
                onValueChange={(value: 'TCP' | 'UDP') => setFormData({ ...formData, protocol: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TCP">TCP</SelectItem>
                  <SelectItem value="UDP">UDP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDescription">Event Description</Label>
              <Select
                value={formData.eventDescription}
                onValueChange={(value: 'Connection Attempt' | 'Suspicious Activity') => 
                  setFormData({ ...formData, eventDescription: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Connection Attempt">Connection Attempt</SelectItem>
                  <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Packet'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PacketForm;