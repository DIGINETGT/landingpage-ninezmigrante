// REACT
import { useContext, useEffect } from 'react';
import HeatMapContext from '../context';

// CONTEXTO global
import StatisticsContext from '../../../context';

// COLORS / UTILS
import { colors } from '../../../../../../../utils/theme';
import getCountryContent from '../../../../../../../utils/country';

/**
 * Hook para cada shape del mapa:
 * devuelve color actual y handler onClick desde el HeatMapContext.
 * Si disableHeat=true, devuelve color mínimo y onClick vacío.
 */
const useHeatmap = (id, disableHeat) => {
  if (!disableHeat) {
    const heatmap = useContext(HeatMapContext);
    return {
      ...heatmap,
      color: heatmap.colorScales[id] ?? colors.heatMin[100],
      onClick: heatmap.onClick(id),
    };
  }
  return { color: colors.heatMin[100], onClick: () => {} };
};

/**
 * Calcula la escala de color por departamento usando depTotals del StatisticsContext.
 * NO hace llamadas a la API.
 *
 * @param setColorScales - setter del estado local en <HeatMap />
 * @param countryID - 'gt' | 'sv' | 'hn' (para color base)
 * @param depTotals - objeto { [depName]: total } ya agregado
 */
export const useHeatColors = (setColorScales, countryID, depTotals) => {
  const setColor = (countryID, escala) =>
    getCountryContent({
      countryID,
      content: {
        guatemala: `rgba(146,189,87, ${escala})`,
        honduras: `rgba(221,184,65, ${escala})`,
        elsalvador: `rgba(96, 134, 167, ${escala})`,
      },
    });

  useEffect(() => {
    const entries = Object.entries(depTotals || {});
    if (!entries.length) {
      setColorScales({});
      return;
    }

    const higher = Math.max(
      ...entries.map(([, total]) => Number(total || 0)),
      0
    );
    const scales = {};
    for (const [dep, totalRaw] of entries) {
      const total = Number(totalRaw || 0);
      const percent = higher > 0 ? total / higher : 0;
      const scale = Math.round((percent + Number.EPSILON) * 100) / 100; // 2 decimales
      scales[dep] =
        scale === 0 ? colors.heatMin[100] : setColor(countryID, scale);
    }

    setColorScales(scales);
  }, [countryID, depTotals, setColorScales]);
};

export default useHeatmap;
