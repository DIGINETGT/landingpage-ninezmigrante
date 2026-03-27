import { createContext } from "react";

const defContext = {
  isScreenShotTime: false,
  isCompareView: false,
  demographicsLoading: false,
  returnsLoading: false,
  mapLoading: false,
  setIsScreenShotTime: () => {},
};

const StatisticsContext = createContext(defContext);
export default StatisticsContext;
