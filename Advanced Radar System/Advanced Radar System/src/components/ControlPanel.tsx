
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Target, AlertTriangle } from 'lucide-react';

interface ControlPanelProps {
  isScanning: boolean;
  onToggleScan: () => void;
  currentAngle: number;
  beepEnabled?: boolean;
  onToggleBeep?: () => void;
  objectTracking?: boolean;
  onToggleTracking?: () => void;
  alertsEnabled?: boolean;
  onToggleAlerts?: () => void;
  maxRange?: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isScanning,
  onToggleScan,
  currentAngle,
  beepEnabled = true,
  onToggleBeep = () => {},
  objectTracking = true,
  onToggleTracking = () => {},
  alertsEnabled = true,
  onToggleAlerts = () => {},
  maxRange = 500
}) => {
  return (
    <Card className="bg-gray-800 border-green-500 border-opacity-30">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-400 font-mono text-lg">
          CONTROL PANEL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={onToggleScan}
          className={`w-full font-mono ${
            isScanning 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isScanning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              STOP SCAN
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              START SCAN
            </>
          )}
        </Button>

        {/* Audio Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onToggleBeep}
            variant="outline"
            size="sm"
            className={`font-mono ${
              beepEnabled 
                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300 border-gray-600'
            }`}
          >
            {beepEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
            BEEP
          </Button>

          <Button
            onClick={onToggleAlerts}
            variant="outline"
            size="sm"
            className={`font-mono ${
              alertsEnabled 
                ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600' 
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300 border-gray-600'
            }`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            ALERT
          </Button>
        </div>

        <Button
          onClick={onToggleTracking}
          variant="outline"
          size="sm"
          className={`w-full font-mono ${
            objectTracking 
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
              : 'bg-gray-600 hover:bg-gray-700 text-gray-300 border-gray-600'
          }`}
        >
          <Target className="w-3 h-3 mr-2" />
          OBJECT TRACKING
        </Button>

        <div className="space-y-2">
          <div className="text-green-400 font-mono text-sm">SYSTEM STATUS</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-green-300">Mode:</div>
            <div className="text-white">{isScanning ? 'ACTIVE' : 'STANDBY'}</div>
            
            <div className="text-green-300">Angle:</div>
            <div className="text-white">{currentAngle.toFixed(1)}°</div>
            
            <div className="text-green-300">Range:</div>
            <div className="text-white">{maxRange}cm</div>
            
            <div className="text-green-300">Sweep:</div>
            <div className="text-white">0° - 180°</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-green-400 font-mono text-sm">AUDIO FEATURES</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-green-300">Beeps:</div>
            <div className={beepEnabled ? "text-green-400" : "text-red-400"}>
              {beepEnabled ? 'ENABLED' : 'DISABLED'}
            </div>
            
            <div className="text-green-300">Alerts:</div>
            <div className={alertsEnabled ? "text-orange-400" : "text-red-400"}>
              {alertsEnabled ? 'ENABLED' : 'DISABLED'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-green-400 font-mono text-sm">SERVO MOTOR</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-green-300">Speed:</div>
            <div className="text-white">2°/step</div>
            
            <div className="text-green-300">Step:</div>
            <div className="text-white">50ms</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-green-400 font-mono text-sm">ULTRASONIC</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-green-300">Frequency:</div>
            <div className="text-white">40kHz</div>
            
            <div className="text-green-300">Resolution:</div>
            <div className="text-white">±2cm</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
