import { createContext } from "react";

const defContext = {
  isScreenShotTime: false,
  isCompareView: false,
  setIsScreenShotTime: () => {},
};

const StatisticsContext = createContext(defContext);
export default StatisticsContext;
