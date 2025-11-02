import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Download, Trash2 } from 'lucide-react';

interface CapturedImage {
  id: string;
  name: string;
  dataUrl: string;
  timestamp: number;
  angle: number;
  distance: number;
}

interface ImageCaptureProps {
  detectedObjects: Array<{angle: number, distance: number, id: string}>;
  isScanning: boolean;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ detectedObjects, isScanning }) => {
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCaptureTime, setLastCaptureTime] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastCapturedObjects = useRef<Set<string>>(new Set());

  // Generate a simulated camera image
  const generateSimulatedImage = (angle: number, distance: number): string => {
    console.log(`🖼️ Generating image for object at ${angle}° ${distance}cm`);
    
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Create a simulated radar-like image
    const gradient = ctx.createRadialGradient(160, 120, 0, 160, 120, 120);
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(1, '#111827');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 320, 240);
    
    // Add some noise/static
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(34, 197, 94, ${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * 320, Math.random() * 240, 1, 1);
    }
    
    // Draw object representation based on actual distance
    const objX = 160 + Math.cos((angle * Math.PI) / 180) * Math.min(distance / 4, 80);
    const objY = 120 + Math.sin((angle * Math.PI) / 180) * Math.min(distance / 4, 80);
    
    // Color based on distance (closer = more red, farther = more yellow)
    let objectColor = '#ef4444'; // red for close
    if (distance > 100) objectColor = '#f97316'; // orange
    if (distance > 200) objectColor = '#eab308'; // yellow
    if (distance > 350) objectColor = '#84cc16'; // green for far
    
    ctx.fillStyle = objectColor;
    ctx.beginPath();
    ctx.arc(objX, objY, Math.max(6, 15 - distance / 50), 0, 2 * Math.PI);
    ctx.fill();
    
    // Add crosshair
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 120);
    ctx.lineTo(170, 120);
    ctx.moveTo(160, 110);
    ctx.lineTo(160, 130);
    ctx.stroke();
    
    // Add timestamp and object info
    ctx.fillStyle = '#10b981';
    ctx.font = '14px monospace';
    ctx.fillText(new Date().toLocaleTimeString(), 10, 20);
    ctx.fillText(`${angle.toFixed(0)}° ${distance.toFixed(0)}cm`, 10, 40);
    
    // Add range indicator
    ctx.fillText(`Range: ${distance < 100 ? 'CLOSE' : distance < 250 ? 'MID' : 'FAR'}`, 10, 60);
    
    // Add object highlight
    ctx.strokeStyle = objectColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(objX, objY, Math.max(8, 18 - distance / 50), 0, 2 * Math.PI);
    ctx.stroke();
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const generateObjectName = (angle: number, distance: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dirIndex = Math.floor(((angle + 22.5) % 360) / 45);
    const direction = directions[dirIndex] || 'N';
    
    let objectType = 'Unknown';
    if (distance < 80) objectType = 'Critical_Target';
    else if (distance < 150) objectType = 'Close_Object';
    else if (distance < 250) objectType = 'Medium_Target';
    else if (distance < 350) objectType = 'Distant_Object';
    else objectType = 'Remote_Contact';
    
    const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, '');
    return `${objectType}_${direction}_${distance.toFixed(0)}cm_${timestamp}`;
  };

  // Filter objects to only capture those within radar range (not at max range)
  const getValidObjectsForCapture = () => {
    const validObjects = detectedObjects.filter(obj => 
      obj.distance < 490 && // Only capture objects not at max range (500cm)
      obj.distance > 10 &&  // Exclude very close noise
      obj.angle >= 0 && obj.angle <= 180 // Within radar sweep range
    );
    
    console.log(`🎯 Valid objects for capture: ${validObjects.length}/${detectedObjects.length}`);
    return validObjects;
  };

  // Auto-capture images when new valid objects are detected
  useEffect(() => {
    if (!isScanning) return;

    const validObjects = getValidObjectsForCapture();
    const now = Date.now();
    
    console.log(`📡 Scanning... Found ${validObjects.length} valid objects`);
    
    validObjects.forEach((obj) => {
      const objKey = `${obj.angle.toFixed(0)}_${obj.distance.toFixed(0)}`;
      
      if (!lastCapturedObjects.current.has(objKey) && now - lastCaptureTime > 500) {
        console.log(`📸 AUTO-CAPTURING object at ${obj.angle}° ${obj.distance}cm`);
        
        const imageDataUrl = generateSimulatedImage(obj.angle, obj.distance);
        const imageName = generateObjectName(obj.angle, obj.distance);
        
        const newImage: CapturedImage = {
          id: `auto_${obj.id}_${Date.now()}`,
          name: imageName,
          dataUrl: imageDataUrl,
          timestamp: Date.now(),
          angle: obj.angle,
          distance: obj.distance
        };
        
        setCapturedImages(prev => {
          const updated = [...prev.slice(-9), newImage];
          console.log(`🖼️ Total images captured: ${updated.length}`);
          return updated;
        });
        
        setLastCaptureTime(now);
        lastCapturedObjects.current.add(objKey);
        
        // Show capture feedback
        setIsCapturing(true);
        setTimeout(() => setIsCapturing(false), 300);
      }
    });

    // Clean up old captured objects
    if (lastCapturedObjects.current.size > 100) {
      lastCapturedObjects.current.clear();
    }
  }, [detectedObjects, isScanning, lastCaptureTime]);

  const manualCapture = () => {
    const validObjects = getValidObjectsForCapture();
    if (validObjects.length === 0) {
      console.log("❌ No valid objects to capture manually");
      return;
    }
    
    console.log("📸 MANUAL CAPTURE initiated");
    setIsCapturing(true);
    const latestObject = validObjects[validObjects.length - 1];
    const imageDataUrl = generateSimulatedImage(latestObject.angle, latestObject.distance);
    const imageName = generateObjectName(latestObject.angle, latestObject.distance);
    
    const newImage: CapturedImage = {
      id: `manual_${Date.now()}`,
      name: imageName,
      dataUrl: imageDataUrl,
      timestamp: Date.now(),
      angle: latestObject.angle,
      distance: latestObject.distance
    };
    
    setCapturedImages(prev => [...prev.slice(-9), newImage]);
    
    setTimeout(() => setIsCapturing(false), 500);
  };

  const downloadImage = (image: CapturedImage) => {
    const link = document.createElement('a');
    link.download = `${image.name}.jpg`;
    link.href = image.dataUrl;
    link.click();
  };

  const deleteImage = (imageId: string) => {
    setCapturedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const clearAllImages = () => {
    setCapturedImages([]);
    lastCapturedObjects.current.clear();
  };

  const validObjectsCount = getValidObjectsForCapture().length;

  return (
    <Card className="bg-gray-800 border-green-500 border-opacity-30">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-400 font-mono text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            📸 IMAGE CAPTURE ({capturedImages.length})
            {isCapturing && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={manualCapture}
              disabled={validObjectsCount === 0 || isCapturing}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Camera className="w-3 h-3 mr-1" />
              {isCapturing ? 'CAPTURING...' : 'CAPTURE'}
            </Button>
            {capturedImages.length > 0 && (
              <Button
                onClick={clearAllImages}
                size="sm"
                variant="outline"
                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 py-2 text-xs font-mono text-green-300 border-b border-gray-700">
          Valid targets in range: {validObjectsCount} | Auto-capture: {isScanning ? 'ON' : 'OFF'}
        </div>
        <ScrollArea className="h-64">
          <div className="p-4 space-y-3">
            {capturedImages.length === 0 ? (
              <div className="text-green-300 text-xs font-mono opacity-50 text-center py-8">
                🎯 No images captured yet
                <br />
                Objects within range will be auto-captured
                <br />
                <span className="text-yellow-400">
                  Range: 10cm - 490cm
                </span>
                <br />
                <span className="text-blue-400">
                  Start scanning to begin auto-capture
                </span>
              </div>
            ) : (
              capturedImages.slice().reverse().map((image) => (
                <div 
                  key={image.id}
                  className="bg-gray-700 bg-opacity-50 rounded p-2 space-y-2 border border-green-500 border-opacity-20"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-green-300 truncate">
                      📷 {image.name}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => downloadImage(image)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-green-400 hover:text-white"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => deleteImage(image.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <img 
                    src={image.dataUrl} 
                    alt={image.name}
                    className="w-full h-24 object-cover rounded border border-green-500 border-opacity-50 bg-gray-900"
                  />
                  <div className="text-xs font-mono text-gray-300 grid grid-cols-3 gap-2">
                    <span>📐 {image.angle.toFixed(0)}°</span>
                    <span className={`${image.distance < 100 ? 'text-red-400' : image.distance < 250 ? 'text-orange-400' : 'text-green-400'}`}>
                      📏 {image.distance.toFixed(0)}cm
                    </span>
                    <span>🕐 {new Date(image.timestamp).toLocaleTimeString().slice(0, 5)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ImageCapture;
