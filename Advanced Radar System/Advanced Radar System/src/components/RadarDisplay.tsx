
import React, { useRef, useEffect } from 'react';

interface RadarDisplayProps {
  currentAngle: number;
  scanData: Array<{angle: number, distance: number, timestamp: number}>;
  detectedObjects: Array<{angle: number, distance: number, id: string, tracked?: boolean}>;
  isScanning: boolean;
  maxRange: number;
}

const RadarDisplay: React.FC<RadarDisplayProps> = ({ 
  currentAngle, 
  scanData, 
  detectedObjects, 
  isScanning,
  maxRange = 500
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = Math.min(canvas.offsetWidth, canvas.offsetHeight);
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 20;

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, size, size);

    // Draw distance rings
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    for (let i = 1; i <= 5; i++) {
      const radius = (maxRadius / 5) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI, true);
      ctx.stroke();
    }

    // Draw angle lines
    for (let angle = 0; angle <= 180; angle += 30) {
      const radian = (angle * Math.PI) / 180;
      const x = centerX + Math.cos(Math.PI - radian) * maxRadius;
      const y = centerY + Math.sin(Math.PI - radian) * maxRadius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw distance labels
    ctx.fillStyle = '#10b981';
    ctx.font = '12px monospace';
    ctx.globalAlpha = 0.7;
    ctx.textAlign = 'center';
    
    for (let i = 1; i <= 5; i++) {
      const radius = (maxRadius / 5) * i;
      const distance = (maxRange / 5) * i;
      ctx.fillText(`${distance}cm`, centerX, centerY - radius + 15);
    }

    // Draw angle labels
    ctx.textAlign = 'center';
    for (let angle = 0; angle <= 180; angle += 30) {
      const radian = (angle * Math.PI) / 180;
      const x = centerX + Math.cos(Math.PI - radian) * (maxRadius + 15);
      const y = centerY + Math.sin(Math.PI - radian) * (maxRadius + 15);
      ctx.fillText(`${angle}°`, x, y + 5);
    }

    // Draw scan trail
    ctx.globalAlpha = 1;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
    gradient.addColorStop(0.6, 'rgba(16, 185, 129, 0.3)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

    if (isScanning) {
      // Draw sweep effect
      const sweepAngle = 30; // degrees
      const startAngle = Math.max(0, currentAngle - sweepAngle);
      const endAngle = currentAngle;
      
      const startRadian = (startAngle * Math.PI) / 180;
      const endRadian = (endAngle * Math.PI) / 180;
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, Math.PI - endRadian, Math.PI - startRadian, true);
      ctx.closePath();
      ctx.fill();
    }

    // Draw current scan line
    if (isScanning) {
      const radian = (currentAngle * Math.PI) / 180;
      const x = centerX + Math.cos(Math.PI - radian) * maxRadius;
      const y = centerY + Math.sin(Math.PI - radian) * maxRadius;
      
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw scan data trail
    ctx.globalAlpha = 0.4;
    scanData.forEach((reading, index) => {
      const age = Date.now() - reading.timestamp;
      const alpha = Math.max(0, 1 - age / 5000); // Fade over 5 seconds
      
      if (alpha > 0) {
        const radian = (reading.angle * Math.PI) / 180;
        const distance = Math.min(reading.distance, maxRange);
        const radius = (distance / maxRange) * maxRadius;
        
        const x = centerX + Math.cos(Math.PI - radian) * radius;
        const y = centerY + Math.sin(Math.PI - radian) * radius;
        
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw detected objects
    ctx.globalAlpha = 1;
    detectedObjects.forEach((obj) => {
      const radian = (obj.angle * Math.PI) / 180;
      const distance = Math.min(obj.distance, maxRange);
      const radius = (distance / maxRange) * maxRadius;
      
      const x = centerX + Math.cos(Math.PI - radian) * radius;
      const y = centerY + Math.sin(Math.PI - radian) * radius;
      
      // Draw object blip with different colors based on distance
      let blipColor = '#ef4444'; // default red
      if (obj.distance < 100) blipColor = '#dc2626'; // close - dark red
      else if (obj.distance < 200) blipColor = '#f97316'; // medium - orange
      else if (obj.distance < 350) blipColor = '#eab308'; // far - yellow
      
      // Draw tracked objects differently
      if (obj.tracked) {
        ctx.strokeStyle = blipColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      ctx.fillStyle = blipColor;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw pulsing ring
      const time = Date.now() / 1000;
      const pulseRadius = 4 + Math.sin(time * 3) * 2;
      ctx.strokeStyle = blipColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw center point
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();

  }, [currentAngle, scanData, detectedObjects, isScanning, maxRange]);

  return (
    <div className="relative w-full h-full max-w-[600px] max-h-[600px] aspect-square">
      <canvas 
        ref={canvasRef}
        className="w-full h-full border border-green-500 border-opacity-30 rounded-lg bg-gray-900"
        style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))' }}
      />
      <div className="absolute top-4 left-4 text-green-400 font-mono text-sm">
        <div>Range: {maxRange}cm</div>
        <div>Angle: {currentAngle.toFixed(1)}°</div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          {isScanning ? 'SCANNING' : 'STANDBY'}
        </div>
        <div className="text-xs mt-1">
          Objects: {detectedObjects.length}
        </div>
      </div>
    </div>
  );
};

export default RadarDisplay;
