import React, { useContext } from 'react';
import StatisticsContext from '../../country/components/statistics/context';
import HeatMap from '../../country/components/statistics/components/heatMap';

export default function CompareHeatMap(props) {
  const { filesUrl } = useContext(StatisticsContext) || {};
  return <HeatMap {...props} files={filesUrl} />;
}
