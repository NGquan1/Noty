import React, { useState, useEffect, useRef } from "react";
const SimpleScratchCard = ({ onReveal, prizeImage }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const audioRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#242321";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 60px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("NXN", canvas.width / 2, canvas.height / 2);
    };

    if (img.complete) {
      img.onload();
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
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      draw(e);
    };

    const end = () => {
      isDrawing = false;
      if (audioRef.current) audioRef.current.pause();
      if (getPercent() > 50 && !revealed) {
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

      const x = (clientX - rect.left) * (canvas.width / rect.width);
      const y = (clientY - rect.top) * (canvas.height / rect.height);

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
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
    <div className="relative mx-auto overflow-hidden shadow-lg ">
      <img
        ref={imgRef}
        src={prizeImage}
        alt="Prize"
        className="block w-full h-auto"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-pointer"
      />

      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_79f7c7b014.mp3?filename=scratch-1.mp3"
      />
    </div>
  );
};

export default SimpleScratchCard;
