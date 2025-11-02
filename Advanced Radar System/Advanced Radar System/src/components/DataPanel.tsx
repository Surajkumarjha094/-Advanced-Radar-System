
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataPanelProps {
  scanData: Array<{angle: number, distance: number, timestamp: number}>;
  detectedObjects: Array<{angle: number, distance: number, id: string}>;
}

const DataPanel: React.FC<DataPanelProps> = ({ scanData, detectedObjects }) => {
  const recentData = scanData.slice(-10).reverse();
  
  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      {/* Detected Objects */}
      <Card className="bg-gray-800 border-green-500 border-opacity-30">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 font-mono text-sm">
            DETECTED OBJECTS ({detectedObjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-32">
            <div className="p-4 space-y-2">
              {detectedObjects.length === 0 ? (
                <div className="text-green-300 text-xs font-mono opacity-50">
                  No objects detected
                </div>
              ) : (
                detectedObjects.slice(-8).map((obj) => (
                  <div 
                    key={obj.id}
                    className="flex justify-between text-xs font-mono bg-gray-700 bg-opacity-50 p-2 rounded"
                  >
                    <span className="text-red-400">●</span>
                    <span className="text-white">{obj.angle.toFixed(0)}°</span>
                    <span className="text-green-300">{obj.distance.toFixed(0)}cm</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Readings */}
      <Card className="bg-gray-800 border-green-500 border-opacity-30 flex-1 min-h-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 font-mono text-sm">
            SCAN DATA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-1">
              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-green-300 mb-2 border-b border-green-500 border-opacity-30 pb-1">
                <div>ANGLE</div>
                <div>DIST</div>
                <div>TIME</div>
              </div>
              {recentData.map((reading, index) => (
                <div 
                  key={`${reading.timestamp}-${index}`}
                  className="grid grid-cols-3 gap-2 text-xs font-mono text-white opacity-75"
                >
                  <div>{reading.angle.toFixed(1)}°</div>
                  <div>{reading.distance.toFixed(0)}cm</div>
                  <div>{new Date(reading.timestamp).toLocaleTimeString().split(':').slice(1).join(':')}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="bg-gray-800 border-green-500 border-opacity-30">
        <CardContent className="p-4">
          <div className="text-green-400 font-mono text-sm mb-2">STATISTICS</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-green-300">Readings:</div>
            <div className="text-white">{scanData.length}</div>
            
            <div className="text-green-300">Objects:</div>
            <div className="text-white">{detectedObjects.length}</div>
            
            <div className="text-green-300">Min Dist:</div>
            <div className="text-white">
              {detectedObjects.length > 0 
                ? `${Math.min(...detectedObjects.map(o => o.distance)).toFixed(0)}cm`
                : 'N/A'
              }
            </div>
            
            <div className="text-green-300">Avg Dist:</div>
            <div className="text-white">
              {detectedObjects.length > 0 
                ? `${(detectedObjects.reduce((sum, o) => sum + o.distance, 0) / detectedObjects.length).toFixed(0)}cm`
                : 'N/A'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPanel;
