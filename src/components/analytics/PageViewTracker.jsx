import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { trackEvent } from '../../services/analytics';

const PageViewTracker = () => {
  const location = useLocation();
  const lastTrackedPathRef = useRef('');

  useEffect(() => {
    const nextPath = location.pathname || '/';

    if (lastTrackedPathRef.current === nextPath) {
      return;
    }

    lastTrackedPathRef.current = nextPath;
    trackEvent('page_view');
  }, [location.pathname]);

  return null;
};

export default PageViewTracker;
