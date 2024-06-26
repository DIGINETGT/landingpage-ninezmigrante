import React from "react";
import useHeatmap from "../../../../../../pages/country/components/statistics/components/heatMap/hooks";

// CHAKRA
import { Tooltip } from "@chakra-ui/react";

const LaPaz = ({ customColor = "", disableHeat = false }) => {
  let { color, onClick } = useHeatmap("la_paz", disableHeat);
  color = customColor || color;

  return (
    <Tooltip label="La Paz" placement="auto">
      <path
        onClick={onClick}
        fill={color}
        className="cls-1"
        d="m 171.58094,354.33213 1.17,1.45 0.87,2.3 2.3,-0.14 1.2,0.42 1.33,-0.02 0.2,1.17 0.57,0.95 3.02,0.2 2.24,1.26 2.23,0.27 1.24,1.13 4.21,-2.62 0.28,0.26 0.34,-0.62 0.79,0.47 0.33,-0.48 -0.25,1.3 0.35,0.02 0.5,0.7 -0.05,1.1 0.26,0.49 0.4,0.04 -0.63,1.2 0.27,0.55 -0.17,0.31 0.38,0.1 -0.15,0.82 1.13,0.48 -0.96,1.05 0.52,0.14 0.57,2.13 -0.48,-0.21 -0.43,1.1 -0.77,-0.29 0.31,1.29 -1.25,0.7 -0.51,-0.75 -0.26,0.62 -0.64,-0.39 -0.63,1.09 -0.19,-0.65 -0.84,0.57 -0.3,-0.8 -0.24,0.5 -1.78,1.26 -1.38,-0.26 -1.01,0.3 -0.25,0.37 -1.14,0.18 -0.67,1.09 -1.5,-0.33 -0.91,0.53 -0.69,-0.18 -0.49,0.26 -0.59,-1.02 -3.81,1.72 -0.14,-0.65 -1.28,0.68 -0.4,0.73 0.83,1.1 0.07,1.53 4.02,1.15 1.95,3.12 -1.76,1.11 0.01,1.79 2.81,0.71 2.25,0.07 2.59,4.24 1.78,-1.14 1.15,2.58 -0.41,0.24 0.02,1.55 -0.33,0.12 0.33,0.31 -0.02,1.08 0.31,0.16 -0.33,0.14 0.19,0.56 0.97,-0.63 0.19,-0.8 1.92,-1.58 0.19,-0.95 0.64,-0.56 0.74,-0.27 3.08,0.25 0,0 1.19,6.12 -0.05,3.76 1.44,2.15 -0.6,1.13 0.55,0.41 0.09,0.53 -0.8,2.14 0.19,2.07 -0.63,1.77 0.2,1.51 -1.51,1.09 0.11,2.11 -0.8,1.78 -1.71,1.53 -0.51,1.31 0,0 -2.68,-0.01 -0.93,-1.18 -1.37,-0.58 -0.36,-0.58 -2.84,0.11 -2.63,0.93 0,0 -0.58,-2.85 -2.81,-1.32 -2.84,-2.25 -2.28,0.66 -1.1,-0.05 -2.33,-0.81 -2.71,-0.24 -1.07,-0.75 -0.94,0.4 -1.83,-0.35 -2.52,1.45 -1.58,-0.78 -0.86,0.29 -0.87,-0.8 -5.96,3.41 -0.55,-2.11 -5.91,-8.48 -0.04,-2.26 -2.88,-0.19 -1.35,-0.74 -3.02,1.2 -1.47,-0.2 -0.4,0.62 -1.25,0.28 -0.21,-0.4 -1.02,0.13 -0.34,-0.67 -0.43,0.02 -1.55,-0.07 -0.44,-0.68 -2.05,0.34 0,0 1.19,-6.51 -0.97,-0.97 -1.71,-0.98 -0.73,-1.04 -0.15,-0.97 0.45,0.07 0.53,-0.38 0.43,0.49 0.76,-1.61 0.48,-0.41 0.9,-0.04 0.29,-1.07 0.62,-0.13 1.66,-3.06 0.49,-0.01 0.35,-0.5 0.5,0.07 0.58,-0.87 0.38,0 0.55,-1.03 1.15,-0.57 1,-0.03 0.2,-0.37 0.57,0.17 0.02,-0.52 1.33,-0.37 0.39,-1.42 1.05,-0.86 0.08,-2.14 4.43,-3.21 0.62,-0.82 1.69,-0.88 4.59,0.11 0.44,-1.9 -0.26,-0.44 0.55,-1.36 2.29,-1.25 0.48,0.26 0.36,-1.19 0.58,-0.6 -0.08,-1.53 2.11,-0.75 -0.3,-0.29 0.37,-0.15 -0.17,-0.81 0.42,-0.62 -0.41,-0.85 -0.49,0.01 0.23,-1.35 -0.26,-0.1 0.14,-0.41 -0.57,-0.17 0.94,-0.93 -0.36,-0.61 0.09,-1.25 0.95,0.11 0.11,0.55 1.79,0.21 0.62,-0.3 0.45,0.34 0.81,-0.06 1.4,-1.39 3.8,-2.19 0.7,-1.06 z"
        title="La Paz"
        id="HN-LP"
      />
    </Tooltip>
  );
};

export default LaPaz;
