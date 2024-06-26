import React from "react";
import useHeatmap from "../../../../hooks";

// CHAKRA
import { Tooltip } from "@chakra-ui/react";

const Ocotepeque = () => {
  const { color, onClick } = useHeatmap("ocotepeque");

  return (
    <Tooltip label="Ocotepeque" placement="auto">
      <path
        onClick={onClick}
        fill={color}
        className="cls-1"
        d="m 24.980942,321.24213 1.7,-0.79 2.56,-0.79 1.38,0.03 0.59,-0.37 1.87,1.2 1.87,0.28 2.46,-0.37 1.28,0.56 0.76,-0.16 0.69,2 -0.2,0.84 0.79,1.51 -0.14,1.3 0.64,1.15 1.46,1.69 2.75,1.38 4.25,3.95 -0.02,0.71 -0.53,0.16 0.24,0.79 -0.49,0.69 0.19,1.36 -0.66,0.39 0.75,0.63 1.42,0.04 -0.36,1.82 2.35,2.7 4.67,0.86 0.83,1.77 2.44,-0.66 -0.58,-1.24 0.43,-0.88 -0.53,-0.77 -0.11,-1 0.71,-0.31 1.59,0.49 1.68,-1.23 2.51,-0.74 0,0 2.81,1.02 1.21,-0.5 2.11,0.14 1.03,1.05 -0.41,1.46 0.16,1.23 -0.63,1.04 -0.65,2.67 -0.64,0.72 0.17,1.64 -0.73,0.53 0.27,1.73 -0.6,-0.25 -0.73,1.13 -0.73,0.42 -4.66,1.77 -2.69,-1.64 -0.18,1.61 -0.54,1.26 2.21,2.11 -3.49,0.08 -2.14,-1.5 -0.28,-1.04 -2.18,-0.36 -0.07,4.07 -1.15,2.05 -2.38,1.11 -4.43,0.52 -0.57,2.27 -0.68,0.56 0.2,0.51 -1.68,1.2 -1.24,0.18 1.7,3.36 -0.79,1.65 0.7,3.17 -0.44,1.02 0,0 -1.08,-0.25 -0.26,-0.5 0.44,-0.96 -1.81,-2.97 -4.23,-2.7 -0.3,-0.64 0.72,-1.18 -0.3,-2.29 -0.52,-1.15 -1.42,-0.99 -1.05,-0.08 -4.32,-2.14 -5.22,1.09 -3.59,-0.37 -0.98,-0.39 -3.5,-3.12 -1.21,-0.67 -4.73,-0.53 -4.4800002,-1.16 -3.76,-1.9 -2.10999998,-1.88 -0.12,-4.08 0.26,-1 3.76999998,-1.74 2.18,-1.58 -0.21,-1.24 2.01,-1.5 0.83,-2.24 2.0400002,-1.76 0.72,-1.89 1.02,-0.95 1.46,-0.78 1.11,-0.1 4.55,1.5 1.04,0.15 1.5,-0.31 1.04,-3.54 -0.76,-7.07 z"
        title="Ocotepeque"
        id="HN-OC"
      />
    </Tooltip>
  );
};

export default Ocotepeque;
