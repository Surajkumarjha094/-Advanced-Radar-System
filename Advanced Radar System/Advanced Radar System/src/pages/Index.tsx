import React, { useState, useEffect, useRef } from 'react';
import RadarDisplay from '@/components/RadarDisplay';
import ControlPanel from '@/components/ControlPanel';
import DataPanel from '@/components/DataPanel';
import ImageCapture from '@/components/ImageCapture';
import ApiKeyInput from '@/components/ApiKeyInput';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { playDetectionBeep, playScanBeep, playAlertBeep } from '@/utils/audioUtils';

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState<Array<{angle: number, distance: number, timestamp: number}>>([]);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [detectedObjects, setDetectedObjects] = useState<Array<{angle: number, distance: number, id: string, tracked?: boolean}>>([]);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [beepEnabled, setBeepEnabled] = useState(true);
  const [objectTracking, setObjectTracking] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [maxRange] = useState(500); // Increased range
  
  const { initializeClient, speak } = useTextToSpeech();
  const lastAnnouncedObjects = useRef<Set<string>>(new Set());
  const lastBeepTime = useRef<number>(0);

  const handleApiKeySet = (apiKey: string) => {
    initializeClient(apiKey);
    setHasApiKey(true);
  };

  const getObjectName = (angle: number, distance: number) => {
    // Enhanced object classification
    if (distance < 80) return "Critical obstacle";
    if (distance < 150) return "Close object";
    if (distance < 250) return "Medium target";
    if (distance < 350) return "Distant object";
    return "Remote contact";
  };

  // Enhanced object detection with tracking
  const trackObjects = (newObjects: Array<{angle: number, distance: number, id: string}>) => {
    if (!objectTracking) return newObjects;

    return newObjects.map(newObj => {
      // Check if this object is close to a previously tracked object
      const existingTracked = detectedObjects.find(existing => 
        existing.tracked && 
        Math.abs(existing.angle - newObj.angle) < 15 && 
        Math.abs(existing.distance - newObj.distance) < 30
      );

      return {
        ...newObj,
        tracked: !!existingTracked
      };
    });
  };

  // Enhanced beep system
  const handleBeeps = (objects: Array<{angle: number, distance: number, id: string}>) => {
    if (!beepEnabled) return;

    const now = Date.now();
    const closeObjects = objects.filter(obj => obj.distance < 150);
    const criticalObjects = objects.filter(obj => obj.distance < 80);

    // Alert beep for critical objects
    if (criticalObjects.length > 0 && alertsEnabled && now - lastBeepTime.current > 1000) {
      playAlertBeep();
      lastBeepTime.current = now;
    }
    // Detection beep for close objects
    else if (closeObjects.length > 0 && now - lastBeepTime.current > 2000) {
      playDetectionBeep();
      lastBeepTime.current = now;
    }
    // Scan beep every few seconds during scanning
    else if (isScanning && now - lastBeepTime.current > 3000) {
      playScanBeep();
      lastBeepTime.current = now;
    }
  };

  // Announce detected objects
  useEffect(() => {
    detectedObjects.forEach((obj) => {
      const objectKey = `${obj.angle.toFixed(0)}_${obj.distance.toFixed(0)}`;
      
      if (!lastAnnouncedObjects.current.has(objectKey)) {
        const objectName = getObjectName(obj.angle, obj.distance);
        const announcement = `${objectName} detected at ${obj.angle.toFixed(0)} degrees, ${obj.distance.toFixed(0)} centimeters`;
        speak(announcement);
        lastAnnouncedObjects.current.add(objectKey);
      }
    });

    // Handle beeps
    handleBeeps(detectedObjects);

    // Clean up old announcements
    if (lastAnnouncedObjects.current.size > 50) {
      lastAnnouncedObjects.current.clear();
    }
  }, [detectedObjects, speak, beepEnabled, alertsEnabled, isScanning]);

  // Enhanced radar scanning simulation
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setCurrentAngle(prev => {
        const newAngle = (prev + 2) % 180;
        
        // Simulate distance reading with enhanced object patterns
        let distance = maxRange; // Default max range
        
        // More varied simulated objects
        if (Math.abs(newAngle - 30) < 4) distance = 120 + Math.random() * 20;
        if (Math.abs(newAngle - 60) < 3) distance = 80 + Math.random() * 15;
        if (Math.abs(newAngle - 90) < 5) distance = 200 + Math.random() * 30;
        if (Math.abs(newAngle - 120) < 6) distance = 300 + Math.random() * 40;
        if (Math.abs(newAngle - 150) < 4) distance = 150 + Math.random() * 25;
        
        // Add some random distant objects
        if (Math.random() < 0.05) distance = 350 + Math.random() * 100;
        
        // Add noise to readings
        distance += (Math.random() - 0.5) * 15;
        
        const newReading = {
          angle: newAngle,
          distance: Math.max(10, Math.min(maxRange, distance)),
          timestamp: Date.now()
        };

        setScanData(prev => [...prev.slice(-500), newReading]);

        // Enhanced object detection
        if (distance < maxRange * 0.9) {
          const objectId = `obj_${newAngle.toFixed(0)}_${Date.now()}`;
          setDetectedObjects(prev => {
            const filtered = prev.filter(obj => Math.abs(obj.angle - newAngle) > 10);
            const newObjects = [...filtered, { angle: newAngle, distance, id: objectId }];
            return trackObjects(newObjects);
          });
        }

        return newAngle;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isScanning, maxRange, objectTracking]);

  // Clean old detected objects
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setScanData(prev => prev.filter(reading => now - reading.timestamp < 15000));
      setDetectedObjects(prev => prev.slice(-30)); // Keep last 30 objects
    }, 2000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 overflow-hidden">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-green-400 font-mono">
            ADVANCED RADAR SYSTEM v2.0
          </h1>
          <p className="text-green-300 opacity-75 font-mono text-sm">
            Enhanced Object Detection • Audio Alerts • Extended Range • Object Tracking • Image Capture
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          {/* Radar Display - Takes most space */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <RadarDisplay 
              currentAngle={currentAngle}
              scanData={scanData}
              detectedObjects={detectedObjects}
              isScanning={isScanning}
              maxRange={maxRange}
            />
          </div>

          {/* Control and Data Panels */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <ApiKeyInput 
                onApiKeySet={handleApiKeySet}
                hasApiKey={hasApiKey}
              />
              <ControlPanel 
                isScanning={isScanning}
                onToggleScan={() => setIsScanning(!isScanning)}
                currentAngle={currentAngle}
                beepEnabled={beepEnabled}
                onToggleBeep={() => setBeepEnabled(!beepEnabled)}
                objectTracking={objectTracking}
                onToggleTracking={() => setObjectTracking(!objectTracking)}
                alertsEnabled={alertsEnabled}
                onToggleAlerts={() => setAlertsEnabled(!alertsEnabled)}
                maxRange={maxRange}
              />
            </div>
            <div className="flex flex-col gap-4">
              <DataPanel 
                scanData={scanData}
                detectedObjects={detectedObjects}
              />
              <ImageCapture 
                detectedObjects={detectedObjects}
                isScanning={isScanning}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
