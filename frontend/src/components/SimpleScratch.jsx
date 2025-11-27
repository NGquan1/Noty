import React, { useState, useEffect, useRef } from "react";
const SimpleScratchCard = ({ onReveal, prizeImage }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const initCanvas = () => {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1a1a"; // Slightly lighter black for better contrast
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw "NXN" text
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-0.1); // Slight tilt like in the image
      ctx.fillStyle = "#ffffff";
      ctx.font = `900 italic ${canvas.width / 4}px Arial`; // Dynamic font size
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("NXN", 0, 0);
      
      // Add some "grunge" noise if possible (simple dots)
      for(let i=0; i<50; i++) {
         ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
         ctx.beginPath();
         ctx.arc(
            Math.random() * canvas.width - canvas.width/2, 
            Math.random() * canvas.height - canvas.height/2, 
            Math.random() * 2, 0, Math.PI*2
         );
         ctx.fill();
      }
      ctx.restore();
    };

    if (img.complete) {
      initCanvas();
    } else {
      img.onload = initCanvas;
    }
  }, [prizeImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let isDrawing = false;

    const getPercent = () => {
      if (!canvas.width || !canvas.height) return 0;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const total = imgData.data.length / 4;
      let cleared = 0;
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === 0) cleared++;
      }
      return (cleared / total) * 100;
    };

    const start = (e) => {
      isDrawing = true;
      draw(e);
    };

    const end = () => {
      isDrawing = false;
      if (getPercent() > 40 && !revealed) { // Lower threshold for easier reveal
        setRevealed(true);
        onReveal?.();
      }
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (!clientX || !clientY) return;

      const x = (clientX - rect.left);
      const y = (clientY - rect.top);

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      // Dynamic brush size
      const brushSize = canvas.width / 10; 
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchend", end, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseleave", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchend", end);
      canvas.removeEventListener("touchmove", draw);
    };
  }, [revealed, onReveal]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <img
        ref={imgRef}
        src={prizeImage}
        alt="Prize"
        className="w-full h-full object-cover pointer-events-none"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-pointer touch-none"
      />
    </div>
  );
};

export default SimpleScratchCard;
