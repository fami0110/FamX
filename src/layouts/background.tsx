import { useRef, useEffect, useCallback, useContext } from 'react';
import AppContext from '@/AppContext';
import "@/styles/background.css";

function getCssVariableValue(variable: string) {
  const root = window.getComputedStyle(document.body);
  const res = root.getPropertyValue(variable);
  return res
}

class Meteor {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  h: number;
  vx: number;
  vy: number;
  len: number;

  constructor(ctx: CanvasRenderingContext2D, x: number, h: number) {
    this.ctx = ctx;
    this.x = x;
    this.y = 0;
    this.h = h;
    this.vx = -(4 + Math.random() * 4);
    this.vy = -this.vx;
    this.len = Math.random() * 300 + 500;
  }
  
  flow(): boolean {
    if (this.x < -this.len || this.y > this.h + this.len) {
      return false;
    }
    this.x += this.vx;
    this.y += this.vy;
    return true;
  }
  
  draw(): void {
    const ctx = this.ctx;
    const gra = ctx.createRadialGradient(
      this.x, this.y, 0, 
      this.x, this.y, this.len
    );
    const PI = Math.PI;
    
    gra.addColorStop(0, 'rgba(255,255,255,1)');
    gra.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.save();
    ctx.fillStyle = gra;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, PI / 4, 5 * PI / 4);
    ctx.lineTo(this.x + this.len, this.y - this.len);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export default function Background() {
  const { backgroundGrid, backgroundStars, backgroundVignette } = useContext(AppContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mousePos = useRef({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight / 2 
  });

  const animationFrameId = useRef<number | null>(null);
  
  const meteors = useRef<Meteor[]>([]);
  const meteorTimeoutId = useRef<number | null>(null);
  const isTabVisible = useRef<boolean>(true);

  const meteorGenerator = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
    if (isTabVisible.current) {
      const x = Math.random() * canvas.width + 800;
      meteors.current.push(new Meteor(ctx, x, canvas.height));
    }
    
    meteorTimeoutId.current = window.setTimeout(() => {
      meteorGenerator(canvas, ctx);
    }, Math.random() * 2000);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw meteor
    if (backgroundStars) {
      meteors.current.forEach((meteor, index, arr) => {
        if (meteor.flow()) {
          meteor.draw();
        } else {
          arr.splice(index, 1);
        }
      });
    }

    // Draw vignette
    if (backgroundVignette) {
      const { x, y } = mousePos.current;
      
      const innerRadius = 0;
      const outerRadius = 800;
  
      const gradient = ctx.createRadialGradient(
        x, y, innerRadius,
        x, y, outerRadius
      );
  
      gradient.addColorStop(0, `rgba(${getCssVariableValue("--bg-theme")}, 0.3)`);
      gradient.addColorStop(1, `rgba(${getCssVariableValue("--bg-theme")}, 0.9)`);
  
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

  }, [backgroundStars, backgroundVignette]);

  const animate = useCallback(() => {
    draw();
    animationFrameId.current = requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    };

    const handleVisibilityChange = (): void => {
      isTabVisible.current = !document.hidden;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    handleResize();
    meteorGenerator(canvas, ctx);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (meteorTimeoutId.current) clearTimeout(meteorTimeoutId.current);
      meteors.current = [];
    };
  }, [animate, draw, meteorGenerator]);

  const { theme } = useContext(AppContext);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div 
      id="background" 
      className={`fixed top-0 left-0 w-screen h-screen -z-10 bg-black ${backgroundGrid && "grid"}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}