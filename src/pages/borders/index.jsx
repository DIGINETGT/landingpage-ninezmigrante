// REACT
import React, { useEffect } from 'react';

// REACT ROUTER DOM
import { useParams } from 'react-router-dom';

import CountrySelect from './components/countrySelect';

const BordersPage = () => {
  const { countryID } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [countryID]);

  return <CountrySelect />;
};

export default BordersPage;
