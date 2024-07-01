import React from "react";
import useHeatmap from "../../../../../../pages/country/components/statistics/components/heatMap/hooks";

// CHAKRA
import { Tooltip } from "@chakra-ui/react";

const Francis = ({ customColor = "", disableHeat = false }) => {
  let { color, onClick } = useHeatmap("francisco_morazan", disableHeat);
  color = customColor || color;

  return (
    <Tooltip label="Francisco Morazán" placement="auto">
      <path
        onClick={onClick}
        fill={color}
        className="cls-1"
        d="m 240.89094,301.30213 0.67,0.68 1.04,0.01 0.08,-0.82 0.62,-0.8 -0.63,-1.05 0.31,-0.89 -1.96,-0.48 -0.09,-0.64 0.5,-0.41 -0.02,-0.39 -1.14,-1.09 -0.07,-0.96 2.26,-2.54 1.01,-0.27 0.63,-0.66 -0.18,-2.29 0.25,-1.06 -0.27,-1.26 1.49,-1.8 1.05,0.03 0.85,-0.55 2.04,0.06 0.46,-0.69 0.81,0.4 2.19,-0.26 1.63,1.24 1.55,0.63 1.48,-0.28 1.24,-0.68 1.52,0.12 1.91,-0.36 4.66,1.06 0,0 0.67,1.24 1.69,1.86 0.62,1.65 3.43,0.86 0.33,0.34 0.09,1.14 3.33,1.6 -0.98,0.47 -1.33,2.13 0,1.1 -1.17,0.81 -0.11,0.4 0.58,1.72 -0.12,1.38 1.63,0.99 1.31,3.07 0.33,1.69 -0.62,0.21 0.02,1.49 2.18,1.15 -1.09,3.4 2.63,2.84 1.1,4.59 1.75,4.36 1.93,1.07 1.73,2.28 2.71,0.01 0.5,0.54 0.34,1.44 3.14,1.92 0.74,1.02 0.26,1.3 1.85,1.12 -0.88,3.74 -0.06,1.7 0.81,2.5 1.43,0.41 0.08,1.85 -0.51,1.22 2.63,5.37 -0.3,1.41 0,0 -6.23,4.75 -6.91,5.83 0.45,4.23 -0.2,0.4 -1.51,-0.03 -2.09,3.64 -2.5,2.22 -0.49,0.84 -1.01,0.26 -0.01,2.12 -0.69,0.58 0.5,1.09 -0.86,0.98 -1.79,0.81 -0.59,1.29 0.24,0.59 0.54,-0.34 1.21,0.24 1.7,1.16 -1.81,2.63 -0.07,0.84 -1.63,-0.12 -0.46,-0.37 -0.03,0.29 -1.86,-0.94 -2.85,-0.26 -1.53,2.02 1.96,2.95 2.64,1.72 0.28,2.55 4,1.48 -0.03,5.77 -0.99,0.07 0.56,1.32 -3.9,4.33 -0.46,-0.01 -0.65,-0.74 -2.06,-0.3 -0.72,-0.35 -0.17,-0.49 -0.53,0.49 0.68,2.86 0.41,0.56 -1.59,1.78 -0.19,0.91 0.78,1.14 0.4,1.63 -0.9,3.13 0.6,1.39 -0.63,3.07 -0.54,0.42 -1.72,3.43 -1.26,1.29 -0.96,0.33 -1.95,0.09 -1.57,-0.54 -1.39,-0.02 -0.75,-1.43 -2.23,-1.73 -1,-0.71 -0.79,0.33 0.04,1.01 -0.79,0.19 -0.09,5.28 1.15,1.03 0.67,1.88 1.47,1.88 -1.71,1.11 -1.81,3.13 0.83,2.13 -0.39,0.14 -1.44,-0.99 -0.36,0.09 -4.8,-2.91 -3.1,2.07 0,0 -4.82,-2.24 -3.27,1.01 -1.92,-0.17 -0.08,-0.37 -1.57,-0.74 -1.41,0.54 -0.48,-0.23 -3.49,0.29 -0.22,-1.61 -0.91,-0.06 -0.9,-0.54 -0.94,-1.27 -0.11,-0.81 -0.8,0.12 0.06,-2.01 0.52,-0.46 0.11,-0.87 0.73,-0.64 0.11,-0.78 -1.54,-0.1 -0.66,0.47 -1.29,-0.35 -1.03,-0.72 -2.22,-0.22 -1.55,0.36 -0.38,0.43 0.13,1.93 0.58,0.98 -0.42,0.58 0.15,0.58 -0.77,0.77 0.02,1.96 -0.64,1.32 0.62,0.88 0.11,0.88 0,0 -1.1,-0.1 -0.81,-0.94 -0.86,-0.04 -0.54,-0.39 -0.27,0.19 -0.37,-0.46 -2.81,-0.75 -0.58,-0.78 -2.36,-1.47 -0.27,-0.9 -4.52,0.45 -1.7,-0.68 -3.51,-2.43 -1.29,-0.1 -1.07,0.59 0.25,-3.45 0.43,-0.82 -0.35,-2.96 0.19,-2.56 0,0 0.51,-1.31 1.71,-1.53 0.8,-1.78 -0.11,-2.11 1.51,-1.09 -0.2,-1.51 0.63,-1.77 -0.19,-2.07 0.8,-2.14 -0.09,-0.53 -0.55,-0.41 0.6,-1.13 -1.44,-2.15 0.05,-3.76 -1.19,-6.12 0,0 -0.02,-2.65 3.06,-3.74 1.1,-0.58 4.24,0.74 4.85,-3.62 2.37,-1.15 0.71,-1.53 0.17,-1.23 0.79,-1.14 2.89,-1.17 1.54,0.02 -0.03,-0.39 0.44,-0.09 -0.23,-0.28 0.4,-0.36 -0.61,-0.79 0.96,-0.2 0.32,-0.53 -1.41,-0.26 -0.15,-0.56 -2.1,-0.75 -1.84,-1.16 -1.12,-2.89 3.31,-5.19 0.52,-0.4 3.4,-0.92 1.91,-4.58 0.35,-1.56 -0.82,-0.33 -0.47,-1.53 -2.61,-0.43 0.08,-0.32 1.23,-0.34 0.52,-0.54 0.01,-2.14 -1.49,-0.06 -0.54,-0.85 -1.11,-0.27 -1.07,-1.21 -1.59,-0.3 -1.82,-5.34 5.56,-4.91 0.89,-1.35 0.41,-0.06 -0.25,-1.95 0.82,-1.91 -0.36,-1.44 0.89,-0.38 2.23,0.85 1.39,-0.31 0.05,0.69 0.87,0.49 2.4,-0.06 -0.1,-0.48 0.48,-0.53 -0.25,-1.15 0.51,-0.85 0.49,-0.05 -0.53,-0.72 0.73,-0.75 -0.06,-0.93 -0.54,-1.09 0.17,-0.57 0.63,-0.06 0.11,0.71 0.85,-0.06 0.17,-0.31 -0.65,-0.56 0.16,-0.96 1.24,0 0.96,-1 0.72,-0.23 -0.16,-0.65 0.98,0.21 0.55,-0.21 0.06,-0.56 1.1,-0.32 -0.59,-0.83 0.52,-0.44 -0.19,-1.67 1.31,-0.15 0.04,-1.29 0.64,-0.73 0.13,-1.34 -0.12,-1.16 -0.41,-0.34 0.28,-2.05 -1,-1.37 -0.18,-1.18 -0.62,-0.34 0.28,-1.55 0.78,-0.66 0.39,-1.15 0.8,-0.63 2.09,0.2 1.61,-0.55 0.19,-1.46 -0.77,-1.05 -0.73,-0.1 0.18,-0.52 z"
        title="Francisco Morazán"
        id="HN-FM"
      />
    </Tooltip>
  );
};

export default Francis;
