/* analytics.js */
import Analytics from 'analytics';
import Logger from '../logger';
import googleTagManager from '../tag-manager';
const logger = new Logger('analytics');

const analytics = Analytics({
  plugins: [
    googleTagManager({
      containerId: process.env.NEXT_PUBLIC_GTM_ID,
      enabled: false,
    }),
    {
      name: 'logger',
      enabled: false,
      initialize: () => {
        logger.info('Initialized logger plugin');
      },
      page: ({payload}) => {
        logger.debug('page', payload);
      },
      track: ({payload}) => {
        logger.debug('track', payload);
      },
      identify: ({payload}) => {
        logger.debug('identify', payload);
      },
    },
  ],
});

export const doTrack = () => {
  analytics.track('buttonClicked', {
    foo: 'bar',
  });
};
/* export for consumption in your components for .track & .identify calls */
export default analytics;
