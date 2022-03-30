import Logger from '../logger';
const logger = new Logger('GTM Analytics');

export const configTrack = {
  debug: false,
  containerId: null,
  dataLayerName: 'dataLayer',
  dataLayer: undefined,
  preview: undefined,
  auth: undefined,
  // assumesPageview: true,
};

let initializedDataLayerName = 'dataLayer';
const regexCache = {};

/*
TODO add logic to make it impossible to load 2 plugins with the same container ID
[containerID]: pluginName
*/
function scriptLoaded(containerId) {
  let regex = regexCache[containerId];
  if (!regex) {
    regex = new RegExp(`googletagmanager\\.com\\/gtm\\.js.*[?&]id=${containerId}`);
    regexCache[containerId] = regex;
  }
  const scripts = document.querySelectorAll('script[src]');
  return !!Object.keys(scripts).filter((key) => (scripts[key].src || '').match(regex)).length;
}

/**
 * Google tag manager plugin
 * @link https://getanalytics.io/plugins/google-tag-manager
 * @link https://developers.google.com/tag-manager/
 * @param {object} pluginConfig - Plugin settings
 * @param {string} pluginConfig.containerId - The Container ID uniquely identifies the GTM Container.
 * @param {string} [pluginConfig.dataLayerName=dataLayer] - The optional name for dataLayer-object. Defaults to dataLayer.
 * @param {string} [pluginConfig.customScriptSrc] - Load Google Tag Manager script from a custom source
 * @param {string} [pluginConfig.preview] - The preview-mode environment
 * @param {string} [pluginConfig.auth] - The preview-mode authentication credentials
 * @param {boolean} [pluginConfig.enabled] - The preview-mode authentication credentials
 * @return {object} Analytics plugin
 * @example
 *
 * googleTagManager({
 *   containerId: 'GTM-123xyz'
 * })
 */
function googleTagManager(pluginConfig = {}) {
  // Allow for userland overides of base methods
  return {
    name: 'google-tag-manager',
    config: {
      ...configTrack,
      ...pluginConfig,
    },
    initialize: ({ config }) => {
      logger.info('Initialized GTM plugin');
      const { containerId, dataLayerName, customScriptSrc, preview, auth } = config;
      if (!containerId) {
        throw new Error('No google tag manager containerId defined');
      }
      if (preview && !auth) {
        throw new Error(
          'When enabling preview mode, both preview and auth parameters must be defined'
        );
      }
      logger.info('hello from google tag manager');
      const scriptSrc = customScriptSrc || 'https://www.googletagmanager.com/gtm.js';
      if (!scriptLoaded(containerId)) {
        /* eslint-disable */
        (function(w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != 'dataLayer' ? '&l=' + l : '',
              p = preview ? '&gtm_preview=' + preview + '&gtm_auth=' + auth + '&gtm_cookies_win=x' : '';
          j.async = true;
          j.defer = true;
          j.src = `${scriptSrc}?id=` + i + dl + p;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', dataLayerName, containerId);

        /* eslint-enable */
        initializedDataLayerName = dataLayerName;
        window.dataLayer = window.dataLayer || [];
        config.dataLayer = window[dataLayerName];
      }
    },
    page: ({ payload, options, instance, config }) => {
      if (typeof config.dataLayer !== 'undefined') {
        config.dataLayer.push(payload.properties);
      }
    },
    track: ({ payload, options, config }) => {
      if (typeof config.dataLayer !== 'undefined') {
        const { anonymousId, userId, properties } = payload;
        const formattedPayload = properties;
        if (userId) {
          formattedPayload.userId = userId;
        }
        if (anonymousId) {
          formattedPayload.anonymousId = anonymousId;
        }
        if (!properties.category) {
          formattedPayload.category = 'All';
        }
        if (config.debug) {
          logger.info('gtag push', {
            event: payload.event,
            ...formattedPayload,
          });
        }
        config.dataLayer.push({
          event: payload.event,
          ...formattedPayload,
        });
      }
    },
    loaded: () => {
      const hasDataLayer =
        !!initializedDataLayerName &&
        !!(
          window[initializedDataLayerName] &&
          Array.prototype.push !== window[initializedDataLayerName].push
        );
      return scriptLoaded(pluginConfig.containerId) && hasDataLayer;
    },
    methods: {
      setPageID(pageId) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          page_id: pageId,
        });
      },
    },
  };
}

export default googleTagManager;

