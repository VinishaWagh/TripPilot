import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AuroraProps {
  className?: string;
  colorStops?: string[];
  amplitude?: number;
  speed?: number;
}

const Aurora = ({
  className,
  colorStops = ['#0066FF', '#4A90E2', '#6B46C1', '#0066FF'],
  amplitude = 1,
  speed = 1,
}: AuroraProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 102, b: 255 };
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Create multiple flowing gradient layers
      for (let layer = 0; layer < 3; layer++) {
        const layerOffset = layer * 0.5;
        const layerOpacity = 0.3 - layer * 0.08;

        ctx.beginPath();
        ctx.moveTo(0, height);

        // Create flowing wave shape
        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.5 +
            Math.sin((x / width) * Math.PI * 2 + time * speed + layerOffset) *
              height *
              0.2 *
              amplitude +
            Math.sin((x / width) * Math.PI * 4 + time * speed * 0.7 + layerOffset) *
              height *
              0.1 *
              amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        colorStops.forEach((color, index) => {
          const rgb = hexToRgb(color);
          gradient.addColorStop(
            index / (colorStops.length - 1),
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerOpacity})`
          );
        });

        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Add glow effect
      const glowGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        width * 0.6
      );
      glowGradient.addColorStop(0, 'rgba(0, 102, 255, 0.15)');
      glowGradient.addColorStop(0.5, 'rgba(74, 144, 226, 0.08)');
      glowGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);

      time += 0.01;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colorStops, amplitude, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full', className)}
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default Aurora;
export { Aurora };