import React, { useState, useRef, useEffect } from "react";

interface ErosionFilterProps {
  imageUrl: string;
}

const ErosionFilter: React.FC<ErosionFilterProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      context.drawImage(img, 0, 0, img.width, img.height);
      applyErosionFilter(canvas, context);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  const applyErosionFilter = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    const erosionData = Erosion(data, canvas.width, canvas.height);

    context.putImageData(
      new ImageData(erosionData, canvas.width, canvas.height),
      0,
      0,
    );
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

function Erosion(
  src: Uint8ClampedArray,
  width: number,
  height: number,
): Uint8ClampedArray {
  const erosionData = new Uint8ClampedArray(src.length);

  function getPixel(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return 255;
    }

    const offset = (y * width + x) * 4;
    const pixel = src[offset];

    return pixel;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel =
        Math.min(
          getPixel(x - 1, y - 1),
          getPixel(x, y - 1),
          getPixel(x + 1, y - 1),
          getPixel(x - 1, y),
          getPixel(x, y),
          getPixel(x + 1, y),
          getPixel(x - 1, y + 1),
          getPixel(x, y + 1),
          getPixel(x + 1, y + 1),
        ) || 255;

      erosionData[(y * width + x) * 4] = pixel;
      erosionData[(y * width + x) * 4 + 1] = pixel;
      erosionData[(y * width + x) * 4 + 2] = pixel;
      erosionData[(y * width + x) * 4 + 3] = 255;
    }
  }

  return erosionData;
}

export default ErosionFilter;
