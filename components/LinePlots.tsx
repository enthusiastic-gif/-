import React, { useRef, useEffect } from 'react';
import { 
  CANVAS_HEIGHT, 
  SIMULATION_WIDTH, 
  SIDE_PLOT_SIZE,
  COLOR_NEGATIVE, 
  COLOR_POSITIVE, 
  DEFAULT_WAVELENGTH 
} from '../constants';

interface Dynamic1DPlotProps {
  angle: number;
  speed: number;
  isRunning: boolean;
  orientation: 'horizontal' | 'vertical';
}

const Dynamic1DPlot: React.FC<Dynamic1DPlotProps> = ({ angle, speed, isRunning, orientation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);

  const width = orientation === 'horizontal' ? SIMULATION_WIDTH : SIDE_PLOT_SIZE;
  const height = orientation === 'horizontal' ? SIDE_PLOT_SIZE : CANVAS_HEIGHT;

  const draw = (ctx: CanvasRenderingContext2D, t: number) => {
    ctx.clearRect(0, 0, width, height);

    // Math constants
    const theta = (angle * Math.PI) / 180;
    const k = (2 * Math.PI) / DEFAULT_WAVELENGTH;
    const kx = k * Math.sin(theta);
    const kz = k * Math.cos(theta);
    const omega = speed * 2; 

    // Visual constants
    const ampScale = 25;
    
    if (orientation === 'horizontal') {
        // --- Traveling Wave (X-axis) ---
        // E ~ sin(wt - kx * x)
        const midY = height / 2;
        
        // Axis
        ctx.strokeStyle = "#e2e8f0";
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(width, midY); ctx.stroke();

        // Wave
        ctx.beginPath();
        ctx.strokeStyle = `rgb(${COLOR_NEGATIVE.join(',')})`;
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x++) {
            const val = Math.sin(omega * t - kx * x);
            ctx.lineTo(x, midY - val * ampScale);
        }
        ctx.stroke();

        // Label
        ctx.fillStyle = "#64748b";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("平行行波 (Traveling)", 5, height - 5);
        ctx.textAlign = "right";
        ctx.fillText("x →", width - 5, midY - 5);

    } else {
        // --- Standing Wave (Z-axis) ---
        // E ~ sin(kz * z) * sin(wt)
        // z axis goes from bottom (surface) to top
        // Canvas y goes from 0 (top) to height (bottom)
        // So z = height - y
        const midX = width / 2;

        // Axis
        ctx.strokeStyle = "#e2e8f0";
        ctx.beginPath(); ctx.moveTo(midX, 0); ctx.lineTo(midX, height); ctx.stroke();

        // Draw Envelope
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        
        // Right envelope
        ctx.beginPath();
        for (let y = 0; y <= height; y++) {
            const z = height - y;
            const val = Math.sin(kz * z);
            ctx.lineTo(midX + Math.abs(val) * ampScale, y);
        }
        ctx.stroke();
        
        // Left envelope
        ctx.beginPath();
        for (let y = 0; y <= height; y++) {
            const z = height - y;
            const val = Math.sin(kz * z);
            ctx.lineTo(midX - Math.abs(val) * ampScale, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Dynamic Wave
        ctx.beginPath();
        ctx.strokeStyle = `rgb(${COLOR_POSITIVE.join(',')})`;
        ctx.lineWidth = 2;
        const timeFactor = Math.sin(omega * t);
        
        for (let y = 0; y <= height; y++) {
            const z = height - y;
            const spatialPart = Math.sin(kz * z);
            const val = spatialPart * timeFactor;
            // Deflection in X direction
            ctx.lineTo(midX + val * ampScale, y);
        }
        ctx.stroke();

         // Nodes
        ctx.fillStyle = "#334155";
        for (let y = 0; y <= height; y++) {
             const z = height - y;
             if (Math.abs(Math.sin(kz * z)) < 0.05) {
                 ctx.beginPath();
                 ctx.arc(midX, y, 1.5, 0, Math.PI * 2);
                 ctx.fill();
            }
        }

        // Label
        ctx.save();
        ctx.translate(10, height/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillStyle = "#64748b";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("垂直驻波 (Standing)", 0, 0);
        ctx.restore();
        
        ctx.fillStyle = "#64748b";
        ctx.textAlign = "center";
        ctx.fillText("z", midX - 10, 10);
    }
  };

  useEffect(() => {
    const render = () => {
      if (isRunning) {
        timeRef.current += 1;
      }
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        draw(ctx, timeRef.current);
      }
      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [angle, speed, isRunning, orientation]);

  return (
    <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="block bg-slate-50"
    />
  );
};

export default Dynamic1DPlot;