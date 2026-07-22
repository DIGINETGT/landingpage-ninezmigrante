// CountryPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from '@chakra-ui/react'; // 👈 nuevo
import Period from './components/period';
import Statistics from './components/statistics';
import { trackEvent } from '../../services/analytics';

const CountryPage = () => {
  const [period, setPeriod] = useState([]);
  const [year, setYear] = useState();
  const [shouldScroll, setShouldScroll] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false); // 👈 nuevo
  const resultsRef = useRef(null);
  const lastTrackedSearchRef = useRef('');
  const { countryID } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [countryID]);

  // Cuando hay valores válidos, pedimos scroll (inmediato)
  useEffect(() => {
    if (period.length > 0 && year) setShouldScroll(true);
  }, [period, year]);

  useEffect(() => {
    if (!countryID || !year || period.length < 2) return;

    const searchKey = `${countryID}-${year}-${period[0]}-${period[1]}`;
    if (lastTrackedSearchRef.current === searchKey) return;

    lastTrackedSearchRef.current = searchKey;

    const properties = {
      section: 'country',
      periodStartMonth: Number(period[0]),
      periodEndMonth: Number(period[1]),
      filters: {
        country: countryID.toUpperCase(),
        year: Number(year),
      },
    };

    trackEvent('filter_applied', properties);
    trackEvent('search_started', properties);
  }, [countryID, period, year]);

  return (
    <>
      {/* Barra delgadita pegada arriba mientras carga */}
      {loadingStats && (
        <Progress
          size='xs'
          isIndeterminate
          position='sticky'
          top={0}
          zIndex={1000}
        />
      )}

      <Period
        ref={resultsRef}
        setPeriod={setPeriod}
        setYear={setYear}
        period={period}
        year={year}
        loading={loadingStats} // 👈 pasa loading hacia arriba
      />

      {period.length > 0 && year && (
        <Statistics
          ref={resultsRef}
          setPeriod={setPeriod}
          setYear={setYear}
          period={period}
          year={year}
          shouldScroll={shouldScroll}
          onScrolled={() => setShouldScroll(false)}
          onLoadingChange={setLoadingStats} // 👈 recibe loading del hijo
        />
      )}
    </>
  );
};

export default CountryPage;
