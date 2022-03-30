import {createContext, useContext, useEffect, useState} from 'react';
import CookieConsent, {
  getCookieConsentValue,
  resetCookieConsentValue,
} from 'react-cookie-consent';
import analytics from '../../../lib/analytics';

const TrackingStateContext = createContext(null);

export const TrackingProvider = ({isGDPR, children}) => {
  const [canTrack, setCanTrack] = useState(false);
  const consent = getCookieConsentValue();

  const resetCanTrack = () => {
    resetCookieConsentValue();
    setCanTrack(false);
  };

  const toggleTracking = (enablePlugin) => {
    setCanTrack(enablePlugin);
    if (enablePlugin) {
      analytics.plugins.enable('logger');
      analytics.plugins.enable('google-tag-manager');
    } else {
      analytics.plugins.disable('logger');
      analytics.plugins.disable('google-tag-manager');
    }
  };

  useEffect(() => {
    const allowed = (consent === 'true' && isGDPR) || !isGDPR;
    toggleTracking(allowed);
  }, [canTrack, isGDPR]);

  return (
      <TrackingStateContext.Provider value={{canTrack, isGDPR, resetCanTrack}}>
        {children}
        {isGDPR &&
        <CookieConsent onAccept={() => toggleTracking(true)}>This website uses
          cookies to
          enhance the user experience.</CookieConsent>}
      </TrackingStateContext.Provider>
  );
};

export const useTracking = () => useContext(TrackingStateContext);
