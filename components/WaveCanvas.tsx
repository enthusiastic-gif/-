import React, { useRef, useEffect } from 'react';
import { 
    CANVAS_HEIGHT, 
    CANVAS_WIDTH, 
    SIMULATION_WIDTH,
    ENVELOPE_WIDTH,
    COLOR_NEGATIVE, 
    COLOR_POSITIVE, 
    COLOR_ZERO, 
    DEFAULT_WAVELENGTH 
} from '../constants';

interface WaveCanvasProps {
  angle: number;
  speed: number;
  isRunning: boolean;
  showComponent: 'total' | 'incident' | 'reflected';
}

const WaveCanvas: React.FC<WaveCanvasProps> = ({ angle, speed, isRunning, showComponent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);
  
  // Helper to draw an arrow
  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
    const headlen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.font = "bold 14px sans-serif";
    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect((fromX + toX)/2 - textWidth/2 - 4, (fromY + toY)/2 - 14, textWidth + 8, 18);
    
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(label, (fromX + toX)/2, (fromY + toY)/2);
  };

  const drawFrame = (ctx: CanvasRenderingContext2D, width: number, height: number, t: number, thetaDeg: number, mode: string) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,width,height);

    // Use constants for split
    const SIM_WIDTH = SIMULATION_WIDTH;
    const PLOT_WIDTH = ENVELOPE_WIDTH;

    const imageData = ctx.createImageData(SIM_WIDTH, height);
    const data = imageData.data;
    
    const theta = (thetaDeg * Math.PI) / 180;
    const k = (2 * Math.PI) / DEFAULT_WAVELENGTH;
    const kx = k * Math.sin(theta);
    const kz = k * Math.cos(theta);
    const omega = speed * 2; 

    const [rP, gP, bP] = COLOR_POSITIVE;
    const [rN, gN, bN] = COLOR_NEGATIVE;
    const [rZ, gZ, bZ] = COLOR_ZERO;

    // Draw Field
    for (let y = 0; y < height; y++) {
      const z = height - y; 
      const standingPart = Math.sin(kz * z);

      for (let x = 0; x < SIM_WIDTH; x++) {
        let val = 0;

        if (mode === 'total') {
            val = standingPart * Math.sin(omega * t - kx * x);
            val *= 1.1;
        } else if (mode === 'incident') {
            val = Math.cos(omega * t - kx * x - kz * (height - z));
        } else if (mode === 'reflected') {
            val = -Math.cos(omega * t - kx * x + kz * (height - z)); 
        }

        if (val > 1) val = 1;
        if (val < -1) val = -1;

        let r, g, b;
        if (val > 0) {
            r = rZ + (rP - rZ) * val;
            g = gZ + (gP - gZ) * val;
            b = bZ + (bP - bZ) * val;
        } else {
            val = -val;
            r = rZ + (rN - rZ) * val;
            g = gZ + (gN - gZ) * val;
            b = bZ + (bN - bZ) * val;
        }

        const index = (y * SIM_WIDTH + x) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255; 
      }
    }
    
    ctx.putImageData(imageData, 0, 0);

    // --- Draw Side Plot (Standing Wave Envelope) ---
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(SIM_WIDTH, 0, PLOT_WIDTH, height);
    ctx.strokeStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(SIM_WIDTH, 0);
    ctx.lineTo(SIM_WIDTH, height);
    ctx.stroke();

    const centerX = SIM_WIDTH + PLOT_WIDTH / 2;
    ctx.strokeStyle = "#94a3b8";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    if (mode === 'total') {
        ctx.beginPath();
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        for (let y = 0; y <= height; y++) {
            const z = height - y;
            const amplitude = Math.abs(Math.sin(kz * z)); 
            const xOffset = amplitude * (PLOT_WIDTH / 2 - 5);
            if (y === 0) ctx.moveTo(centerX + xOffset, y);
            else ctx.lineTo(centerX + xOffset, y);
        }
        ctx.stroke();
        
        ctx.beginPath();
        for (let y = 0; y <= height; y++) {
            const z = height - y;
            const amplitude = Math.abs(Math.sin(kz * z)); 
            const xOffset = amplitude * (PLOT_WIDTH / 2 - 5);
            if (y === 0) ctx.moveTo(centerX - xOffset, y);
            else ctx.lineTo(centerX - xOffset, y);
        }
        ctx.stroke();

        ctx.fillStyle = "rgba(71, 85, 105, 0.1)";
        ctx.beginPath();
        for (let y = 0; y <= height; y++) {
            const z = height - y;
            const amplitude = Math.abs(Math.sin(kz * z)); 
            const xOffset = amplitude * (PLOT_WIDTH / 2 - 5);
            ctx.lineTo(centerX + xOffset, y);
        }
        for (let y = height; y >= 0; y--) {
            const z = height - y;
            const amplitude = Math.abs(Math.sin(kz * z)); 
            const xOffset = amplitude * (PLOT_WIDTH / 2 - 5);
            ctx.lineTo(centerX - xOffset, y);
        }
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, 20);
        ctx.fillStyle = "#475569";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("|E(z)|", 0, 0);
        ctx.restore();
    } else {
        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "center";
        ctx.font = "10px sans-serif";
        ctx.fillText("Uniform Amp", centerX, 20);
    }

    // --- Overlay Graphics ---
    ctx.fillStyle = "#334155"; 
    ctx.fillRect(0, height - 12, width, 12);
    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("理想导体 (PEC) z=0", 10, height - 2);

    const centerY = height / 2;
    const arrowLen = 60;
    
    if (mode === 'incident') {
        const startX = SIM_WIDTH / 2 - 50;
        const startY = centerY - 50;
        const dirX = Math.sin(theta);
        const dirY = Math.cos(theta);
        drawArrow(ctx, startX, startY, startX + dirX * arrowLen, startY + dirY * arrowLen, "#c2410c", "k_i");
    } else if (mode === 'reflected') {
        const startX = SIM_WIDTH / 2 - 50;
        const startY = centerY + 50;
        const dirX = Math.sin(theta);
        const dirY = -Math.cos(theta); 
        drawArrow(ctx, startX, startY, startX + dirX * arrowLen, startY + dirY * arrowLen, "#047857", "k_r");
    } else if (mode === 'total') {
        const startX = SIM_WIDTH / 2 - 40;
        drawArrow(ctx, startX, centerY, startX + arrowLen + 20, centerY, "#4338ca", "V_phase");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isRunning) {
        timeRef.current += 1;
      }
      drawFrame(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, timeRef.current, angle, showComponent);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [angle, speed, isRunning, showComponent]);

  return (
    <div className="relative block">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Coordinate System Indicator */}
      <div className="absolute bottom-6 left-4 pointer-events-none flex flex-col gap-1 opacity-60">
        <div className="flex items-end gap-1">
             <div className="h-8 w-0.5 bg-slate-900 relative">
                <div className="absolute top-0 -left-1 border-t-2 border-l-2 border-slate-900 rotate-45 w-2 h-2"></div>
            </div>
            <span className="text-xs font-bold text-slate-900 mb-6">z</span>
        </div>
        <div className="flex items-center gap-1 -mt-1">
            <span className="text-xs font-bold text-slate-900">0</span>
            <div className="w-8 h-0.5 bg-slate-900 relative">
                <div className="absolute right-0 -top-1 border-t-2 border-r-2 border-slate-900 rotate-45 w-2 h-2"></div>
            </div>
            <span className="text-xs font-bold text-slate-900">x</span>
        </div>
      </div>
    </div>
  );
};

export default WaveCanvas;