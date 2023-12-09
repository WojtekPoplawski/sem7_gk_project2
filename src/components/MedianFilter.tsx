import React, { useEffect, useRef } from "react";

interface MedianFilterProps {
  imageUrl: string;
  filterSize: number;
}

interface RGBColorComponents {
  r: number;
  g: number;
  b: number;
}

interface HSVColorComponents {
  h: number;
  s: number;
  v: number;
}

const MedianFilter: React.FC<MedianFilterProps> = ({
  imageUrl,
  filterSize,
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

      applyMedianFilter(ctx, img.width, img.height, filterSize);
    };

    img.src = imageUrl;
  }, [imageUrl, filterSize]);

  const applyMedianFilter = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    filterSize: number,
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const halfFilterSize = Math.floor(filterSize / 2);

    const rgbToHsv = (rgb: RGBColorComponents): HSVColorComponents => {
      const { r, g, b } = rgb;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;

      let h = 0;
      if (delta !== 0) {
        if (max === r) {
          h = ((g - b) / delta) % 6;
        } else if (max === g) {
          h = (b - r) / delta + 2;
        } else {
          h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
      }

      const s = max === 0 ? 0 : Math.round((delta / max) * 100);
      const v = Math.round((max / 255) * 100);

      return { h, s, v };
    };

    const hsvToRgb = (hsv: HSVColorComponents): RGBColorComponents => {
      const { h, s, v } = hsv;

      const c = (v / 100) * (s / 100);
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = v / 100 - c;

      let r = 0,
        g = 0,
        b = 0;
      if (h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
      } else {
        r = c;
        g = 0;
        b = x;
      }

      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
      };
    };

    for (let i = halfFilterSize; i < height - halfFilterSize; i++) {
      for (let j = halfFilterSize; j < width - halfFilterSize; j++) {
        const index = (i * width + j) * 4;

        const values = {
          h: [] as number[],
          s: [] as number[],
          v: [] as number[],
        };

        for (let m = -halfFilterSize; m <= halfFilterSize; m++) {
          for (let n = -halfFilterSize; n <= halfFilterSize; n++) {
            const pixelIndex = ((i + m) * width + j + n) * 4;

            const { r, g, b } = {
              r: data[pixelIndex],
              g: data[pixelIndex + 1],
              b: data[pixelIndex + 2],
            };

            const { h, s, v } = rgbToHsv({ r, g, b });

            values.h.push(h);
            values.s.push(s);
            values.v.push(v);
          }
        }

        for (const color of ["h", "s", "v"] as const) {
          values[color].sort((a, b) => a - b);
          const medianValue =
            values[color as keyof typeof values][
              Math.floor(values[color as keyof typeof values].length / 2)
            ];

          let hsvComponent: HSVColorComponents;
          if (color === "h") {
            hsvComponent = { h: medianValue, s: values.s[4], v: values.v[4] };
          } else {
            hsvComponent = { h: values.h[4], s: values.s[4], v: values.v[4] };
          }

          const { r, g, b } = hsvToRgb(hsvComponent);

          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
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

export default MedianFilter;
