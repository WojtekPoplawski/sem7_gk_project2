import React, { ChangeEvent, useState } from "react";
import "./App.css";
import { Grid } from "@mui/material";
import SmoothingFilter from "./components/SmoothingFilter";
import MedianFilter from "./components/MedianFilter";
import SobelFilter from "./components/SobelFilter";
import DilatationFilter from "./components/DilatationFilter";
import ErosionFilter from "./components/ErosionFilter";

const App = () => {
  const [imageFile, setImageFile] = useState<string | null | undefined>(
    undefined,
  );
  const [filterType, setFilterType] = useState<
    "smoothing" | "median" | "sobel" | "dilatation" | "erosion" | undefined
  >(undefined);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      setImageFile(URL.createObjectURL(event.target.files[0]));
    }
  };

  const filterImage = () => {
    if (imageFile !== null && imageFile !== undefined) {
      switch (filterType) {
        case "smoothing":
          return <SmoothingFilter imageUrl={imageFile} smoothingFactor={0.5} />;
        case "median":
          return <MedianFilter imageUrl={imageFile} filterSize={3} />;
        case "sobel":
          return <SobelFilter imageUrl={imageFile} />;
        case "dilatation":
          return <DilatationFilter imageUrl={imageFile} />;
        case "erosion":
          return <ErosionFilter imageUrl={imageFile} />;
      }
    } else {
      return <></>;
    }
  };

  return (
    <div className="App">
      <Grid item sx={{ width: window.innerWidth, height: window.innerHeight }}>
        <Grid item sx={{ padding: "1rem" }}>
          <label htmlFor="file">Upload images</label>
          <input
            type="file"
            id="file"
            onChange={(event) => {
              handleFileUpload(event);
            }}
            accept="image/*"
          />
          <button
            disabled={
              !(
                imageFile != null ||
                imageFile !== undefined ||
                filterType === "smoothing"
              )
            }
            onClick={() => setFilterType("smoothing")}
          >
            smoothing
          </button>
          <button
            disabled={
              !(
                imageFile != null ||
                imageFile !== undefined ||
                filterType === "median"
              )
            }
            onClick={() => setFilterType("median")}
          >
            median
          </button>
          <button
            disabled={
              !(
                imageFile != null ||
                imageFile !== undefined ||
                filterType === "sobel"
              )
            }
            onClick={() => setFilterType("sobel")}
          >
            sobel
          </button>
          <button
            disabled={
              !(
                imageFile != null ||
                imageFile !== undefined ||
                filterType === "dilatation"
              )
            }
            onClick={() => setFilterType("dilatation")}
          >
            dilatation
          </button>
          <button
            disabled={
              !(
                imageFile != null ||
                imageFile !== undefined ||
                filterType === "erosion"
              )
            }
            onClick={() => setFilterType("erosion")}
          >
            erosion
          </button>
          <button
            disabled={imageFile == null || imageFile === undefined}
            onClick={() => setFilterType(undefined)}
          >
            clear
          </button>
        </Grid>
        <Grid container item sx={{ padding: "1rem" }}>
          <Grid container item xs={6} sx={{ padding: "1rem" }}>
            {imageFile !== undefined && imageFile !== null && (
              <>
                <img
                  style={{
                    objectFit: "scale-down",
                    width: "90%",
                    height: "90%",
                  }}
                  src={imageFile}
                  alt={""}
                />
              </>
            )}
          </Grid>
          <Grid container item xs={6} sx={{ padding: "1rem" }}>
            {imageFile !== undefined && imageFile !== null && (
              <>{filterImage()}</>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
