import React from "react";
import useHeatmap from "../../../../hooks";

// CHAKRA
import { Tooltip } from "@chakra-ui/react";

const Suchitepequez = () => {
  const { color, onClick } = useHeatmap("suchitepequez");

  return (
    <Tooltip label="Suchitepéquez" placement="auto">
      <path
        onClick={onClick}
        d="m 118.52741,467.58 0,0 0.7,-1.98 0.12,-1.11 -0.1,-1.82 0.04,-0.42 0.13,-0.41 0.22,-0.4 0.38,-0.38 0.68,-0.48 0.49,-0.27 0.85,-0.28 1.08,0.1 2.09,0.99 1.59,1.89 0.12,0.08 3.13,-0.28 1.58,-0.35 0.52,0.09 0.41,0.12 1.46,1.58 4.06,3.62 0.63,0.76 0.26,0.6 0.22,1.18 0.04,1.34 -0.05,0.44 -0.33,1.63 -0.01,0.44 0.07,0.41 0.42,0.29 0.39,0.21 3.16,-0.45 3.88,-2.05 1.23,-0.16 1.44,0.04 0.82,0.15 1.35,0.5 1.86,1.17 5.45,4.2 0.97,0.89 0.89,0.97 0.5,0.66 0.26,1.41 -0.25,3.25 0,1.89 -1.98,5.37 -3.95,8.15 -0.92,2.46 -0.4,6.91 -0.15,0.81 -0.19,0.57 -0.64,0.94 -1.24,2.45 -0.86,0.56 -16.31,-1.21 -0.89,-0.22 0.7,-3.46 -1.52,-1.5 -2.55,2.84 -1.13,0.69 -1.39,0.04 -0.91,-0.15 -0.54,-0.23 -0.7,-0.43 -0.6,-0.57 -0.29,-0.46 -0.14,-0.42 -0.04,-0.42 0.04,-0.43 0.29,-1.2 -0.02,-0.46 -0.14,-0.46 -0.68,-0.94 -0.2,-0.36 -0.13,-0.34 0,-0.4 0.1,-0.38 0.14,-0.34 1.02,-1.51 -0.02,-0.55 -0.26,-0.71 -0.9,-1.41 -0.61,-0.47 -0.54,-0.22 -1.14,0.37 -0.65,0.35 -3.98,2.94 -0.5,0.51 -0.19,0.3 -0.29,0.68 -0.3,1.21 -0.04,0.9 0.08,0.91 0.24,1.26 0.27,0.72 0.67,1.28 0.13,0.35 0.04,0.37 -0.28,0.42 -0.47,0.41 -0.98,0.59 -0.58,0.14 -0.38,-0.12 -0.19,-0.31 -0.36,-1.11 -0.49,-0.67 -1.1,-0.79 -1.45,0.9 -0.21,0.48 -0.25,0.99 -0.08,1.75 0.07,1.16 0.53,3.41 0.32,5.81 -0.18,2.32 -0.86,1.15 -0.73,0.74 -0.67,1.09 -1.14,2.5 -6.79,10.05 -0.3,0.8 -0.13,0.67 0.47,2.23 0.14,1.18 0.02,0.17 -3.29,-1.46 -11.91,-6.8 -2.99,-1.86 -0.11,-1.17 -0.83,-5.76 3.99,-5.94 0.15,-0.32 0.16,-0.91 0.29,-4.74 0.65,-4.3 1.74,-5.32 1.59,-2.37 0.11,-0.66 0.07,-0.94 -0.09,-1.92 0.64,-9.39 -0.08,-1.07 -1.77,-3.17 -0.28,-0.72 -0.21,-0.75 -0.11,-0.87 1.11,-8.46 -0.06,-0.42 -0.01,-0.47 0.06,-0.9 5.52,-11.33 -0.08,-1.42 -0.11,-1.84 0.08,-1.63 0.09,-0.41 0.43,-0.88 0.37,-0.57 3.17,-3.59 4.21,-3.73 5.7,-3.85 0.68,0.84 0.4,0.67 1.74,4.65 0.16,0.8 0.04,0.49 -0.67,2.03 -3.31,6.38 2.05,1.97 6.37,0.88 1.87,0.52 z"
        title="Suchitepéquez"
        className="cls-1"
        fill={color}
        id="GT-SU"
      />
    </Tooltip>
  );
};

export default Suchitepequez;
