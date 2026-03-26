import { createContext } from "react";

const defContext = {
  isScreenShotTime: false,
  isCompareView: false,
  mapLoading: false,
  setIsScreenShotTime: () => {},
};

const StatisticsContext = createContext(defContext);
export default StatisticsContext;
