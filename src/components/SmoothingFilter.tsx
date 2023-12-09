import React, { useEffect, useRef } from "react";

interface SmoothingFilterProps {
  imageUrl: string;
  smoothingFactor: number;
}

const SmoothingFilter: React.FC<SmoothingFilterProps> = ({
  imageUrl,
  smoothingFactor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      applySmoothingFilter(ctx, img.width, img.height, smoothingFactor);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  const applySmoothingFilter = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    smoothingFactor: number,
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 1; i < height - 1; i++) {
      for (let j = 1; j < width - 1; j++) {
        const index = (i * width + j) * 4;

        for (let k = 0; k < 3; k++) {
          data[index + k] =
            ((data[index - 4 - width * 4 + k] +
              data[index - width * 4 + k] +
              data[index + 4 - width * 4 + k] +
              data[index - 4 + k] +
              data[index + k] +
              data[index + 4 + k] +
              data[index - 4 + width * 4 + k] +
              data[index + width * 4 + k] +
              data[index + 4 + width * 4 + k]) /
              9) *
              (1 - smoothingFactor) +
            data[index + k] * smoothingFactor;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <canvas
      style={{
        objectFit: "scale-down",
        width: "90%",
        height: "90%",
      }}
      ref={canvasRef}
    />
  );
};

export default SmoothingFilter;
