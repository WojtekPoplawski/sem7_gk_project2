import React, { useState, useRef, useEffect } from "react";

interface SobelFilterProps {
  imageUrl: string;
}

const SobelFilter: React.FC<SobelFilterProps> = ({ imageUrl }) => {
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
      applySobelFilter(canvas, context);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  const applySobelFilter = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    const sobelData = Sobel(data, canvas.width, canvas.height);

    context.putImageData(
      new ImageData(sobelData, canvas.width, canvas.height),
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

function Sobel(
  src: Uint8ClampedArray,
  width: number,
  height: number,
): Uint8ClampedArray {
  const kernelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];

  const kernelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];

  const sobelData = new Uint8ClampedArray(src.length);

  function getPixel(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return 0;
    }

    const offset = (y * width + x) * 4;
    const pixel = (src[offset] + src[offset + 1] + src[offset + 2]) / 3;

    return pixel;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelX =
        kernelX[0][0] * getPixel(x - 1, y - 1) +
        kernelX[0][1] * getPixel(x, y - 1) +
        kernelX[0][2] * getPixel(x + 1, y - 1) +
        kernelX[1][0] * getPixel(x - 1, y) +
        kernelX[1][1] * getPixel(x, y) +
        kernelX[1][2] * getPixel(x + 1, y) +
        kernelX[2][0] * getPixel(x - 1, y + 1) +
        kernelX[2][1] * getPixel(x, y + 1) +
        kernelX[2][2] * getPixel(x + 1, y + 1);

      const pixelY =
        kernelY[0][0] * getPixel(x - 1, y - 1) +
        kernelY[0][1] * getPixel(x, y - 1) +
        kernelY[0][2] * getPixel(x + 1, y - 1) +
        kernelY[1][0] * getPixel(x - 1, y) +
        kernelY[1][1] * getPixel(x, y) +
        kernelY[1][2] * getPixel(x + 1, y) +
        kernelY[2][0] * getPixel(x - 1, y + 1) +
        kernelY[2][1] * getPixel(x, y + 1) +
        kernelY[2][2] * getPixel(x + 1, y + 1);

      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);

      sobelData[(y * width + x) * 4] = magnitude;
      sobelData[(y * width + x) * 4 + 1] = magnitude;
      sobelData[(y * width + x) * 4 + 2] = magnitude;
      sobelData[(y * width + x) * 4 + 3] = 255;
    }
  }

  return sobelData;
}

export default SobelFilter;
