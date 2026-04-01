(function (f) {
  typeof define === 'function' && define.amd ? define(f) : f();
})(function () {
  var _a;
  const STORYLINES_IFRAME_CSS = `
  .storylines-container {
    --storylines-margins: 0px;
    height: 433px !important;
    margin: 0 auto !important;
    max-width: 100% !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: relative !important;
    width: 100% !important;
  }

  .storylines-container iframe {
    height: 433px !important;
    max-height: 100% !important;
    max-width: 100% !important;
    min-width: 100% !important;
    width: 100% !important;
  }

  .storylines-container.expanded iframe {
    height: 100% !important;
    width: 100% !important;
  }
  
  @media only screen and (max-width: 767px) and (orientation: portrait) {
    .storylines-container {
      max-width: calc(100vw - var(--storylines-margins)) !important;
      width: calc(100vw - var(--storylines-margins)) !important;
    }

    .storylines-container.expanded {
      max-width: 100vw !important;
    }
    
    .storylines-container.edge-scroll {
      margin-left: var(--storylines-margin-left, 0) !important;
      max-width: 100vw !important;
      width: 100vw !important;
    }
  }

  .storylines-container.expanded {
    height: auto !important;
    inset: 0 !important;
    position: fixed !important;
    width: auto !important;
    z-index: 2147483647 !important;
  }
  
  /* when in fullscreen, hide everything except for our iframe and container and its children */
  .seenthis-storylines-fullscreen *:not([data-story-key]):not([data-story-key] *):not(.storylines-container):not(.storylines-container *) {
    visibility: hidden !important;
    transform: none !important;
  }
  [data-story-key],
  .storylines-container {
    visibility: visible !important;
  } 
  `;
  function allowsFrameAccessOf(_window, property) {
    try {
      return Boolean(_window && property in _window);
    } catch (err) {
      return false;
    }
  }
  function hasFrameElement() {
    try {
      return Boolean(window.frameElement);
    } catch (err) {
      return false;
    }
  }
  const LOG_PREFIX = '[storylines]';
  const LOG_HISTORY_LIMIT = 1e3;
  const LOG_HISTORY = [];
  const safeStringify = (data) => {
    try {
      return JSON.stringify(
        data,
        (_, value) => (value === void 0 ? 'undefined' : value),
        2
      );
    } catch (error) {
      logger.warn('Error stringifying data', error);
      return '';
    }
  };
  const colorMap = {
    gray: '#6c757d',
    lightgray: '#6c757d',
    blue: '#007bff',
    green: '#28a745',
    orange: '#fd7e14',
    purple: '#6f42c1',
    red: '#dc3545',
  };
  const DEFAULT_LOG_LEVEL = 'warn';
  const LogLevelMap = {
    debug: 1,
    warn: 2,
    error: 3,
  };
  const ConsoleFunctionMap = {
    debug: console.debug,
    warn: console.warn,
    error: console.error,
  };
  function getLogLevel({
    eventsEnabled: eventsEnabled2,
    logLevelParam,
    isDev,
  }) {
    if (eventsEnabled2) return 'debug';
    if (logLevelParam && logLevelParam in LogLevelMap) {
      return logLevelParam;
    } else if (logLevelParam) {
      console.error(
        `${LOG_PREFIX} - Invalid STORYLINES_LOG_LEVEL ${logLevelParam} - must be one of ${Object.keys(LogLevelMap).join(', ')}`
      );
    }
    return isDev ? 'debug' : DEFAULT_LOG_LEVEL;
  }
  let urlParams = new URLSearchParams();
  if (typeof window !== 'undefined') {
    try {
      urlParams = new URLSearchParams(
        (_a = window.top) == null ? void 0 : _a.location.search
      );
    } catch (err) {
      urlParams = new URLSearchParams(window.location.search);
    }
  }
  const eventsEnabled = urlParams.get('STORYLINES_LOG_EVENTS') === 'true';
  const currentLogLevel = getLogLevel({
    eventsEnabled,
    logLevelParam: urlParams.get('STORYLINES_LOG_LEVEL'),
    isDev:
      typeof window !== 'undefined' && window.location.hostname === 'localhost',
    // FIXME: use isDev from @config but that causes build to fail
  });
  const logger = {
    error: (message, data = null, options = {}) => {
      logWithLevel('error', message, data, options);
    },
    warn: (message, data = null, options = {}) => {
      logWithLevel('warn', message, data, options);
    },
    debug: (message, data = null, options = {}) => {
      logWithLevel('debug', message, data, options);
    },
    getLevel: () => {
      return currentLogLevel;
    },
    eventsEnabled: () => {
      return eventsEnabled;
    },
    getHistory: () => {
      return LOG_HISTORY;
    },
    clearHistory: () => {
      LOG_HISTORY.length = 0;
    },
  };
  function logWithLevel(level, message, data = null, options = {}) {
    var _a2;
    if (LogLevelMap[level] < LogLevelMap[currentLogLevel]) return;
    let fullMessageForHistory = message;
    const errorMessage =
      ((_a2 = data == null ? void 0 : data.error) == null
        ? void 0
        : _a2.message) || (data == null ? void 0 : data.message);
    if (LogLevelMap[level] >= LogLevelMap['error'] && errorMessage) {
      fullMessageForHistory = `${message} - ${errorMessage}`;
    }
    const prefixedConsoleMessage = `${LOG_PREFIX} ${fullMessageForHistory}`;
    const parsedData =
      data !== null && data !== void 0
        ? options.stringify
          ? safeStringify(data)
          : data
        : null;
    const consoleArgs = parsedData !== null ? [parsedData] : [];
    let loggedToConsole = false;
    if (level === 'debug' && options.color) {
      const cssColor = colorMap[options.color];
      if (cssColor) {
        console.log(
          `%c${prefixedConsoleMessage}`,
          `color: ${cssColor}`,
          ...consoleArgs
        );
        loggedToConsole = true;
      }
    }
    if (!loggedToConsole) {
      const consoleFunction = ConsoleFunctionMap[level];
      consoleFunction(prefixedConsoleMessage, ...consoleArgs);
    }
    const timestamp = /* @__PURE__ */ new Date().toISOString();
    const logEntry = { timestamp, level, message: fullMessageForHistory, data };
    LOG_HISTORY.push(logEntry);
    if (LOG_HISTORY.length > LOG_HISTORY_LIMIT) {
      LOG_HISTORY.shift();
    }
  }
  const DEFAULT_MARGINS = '16px';
  function calculateMargins(element, log2 = false) {
    const boundingClientRect = element.getBoundingClientRect();
    const wrapperLeftMargin = window.getComputedStyle(element).marginLeft;
    const marginLeft =
      boundingClientRect.left - parseInt(wrapperLeftMargin, 10);
    if (boundingClientRect.width === 0 || marginLeft === 0) {
      element.style.setProperty('--storylines-margins', DEFAULT_MARGINS);
      element.style.setProperty('--storylines-margin-left', DEFAULT_MARGINS);
      return;
    }
    element.style.setProperty('--storylines-margin-left', `-${marginLeft}px`);
    element.style.setProperty('--storylines-margins', `${marginLeft * 2}px`);
    if (log2) {
      logger.debug('calculated margins', { marginLeft, wrapperLeftMargin });
    }
  }
  const BROADCAST_EVENT_TYPES = [
    '@seenthis_storylines/ready',
    '@seenthis_enabled',
    '@seenthis_disabled',
    '@seenthis_metric',
    '@seenthis_detach',
    '@seenthis_modal/opened',
    '@seenthis_modal/closed',
    '@seenthis_modal/beforeopen',
    '@seenthis_modal/beforeclose',
  ];
  const fixes = {
    'full-width': {
      isApplicable: (_) => {
        return true;
      },
      css: ``,
      js: (target) => {
        logger.debug('Applying full-width fix');
        const adWrapper = findAdWrapper(target);
        if (adWrapper) {
          addStyleToSingleChildAncestors(adWrapper, {
            key: 'width',
            value: '100%',
          });
        }
      },
    },
    'auto-height': {
      isApplicable: (_) => {
        return true;
      },
      css: ``,
      js: (target) => {
        logger.debug('Applying auto-height fix');
        const adWrapper = findAdWrapper(target);
        if (adWrapper) {
          const parent = adWrapper.parentElement;
          if (parent) {
            addStyleToSingleChildAncestors(parent, {
              key: 'height',
              value: 'auto',
            });
            addStyleToSingleChildAncestors(parent, {
              key: 'min-height',
              value: 'auto',
            });
          }
        }
      },
    },
  };
  function addStyleToSingleChildAncestors(element, { key, value }) {
    var _a2;
    const elementWidth = element.offsetWidth;
    const windowWidth =
      hasFrameElement() && allowsFrameAccessOf(window.parent, 'innerWidth')
        ? window.parent.innerWidth
        : window.innerWidth;
    if (key in element.style && elementWidth < windowWidth) {
      element.style.setProperty(key, value);
    }
    if (
      !element.parentElement ||
      ((_a2 = element.parentElement) == null ? void 0 : _a2.children.length) > 1
    ) {
      logger.debug(
        'Parent has more than one child, stopping here.',
        element.parentElement
      );
      return;
    }
    addStyleToSingleChildAncestors(element.parentElement, { key, value });
  }
  const findAdWrapper = (target) => {
    var _a2;
    if (
      (window == null ? void 0 : window.frameElement) &&
      /^google_ads_iframe_/.test(
        (window == null ? void 0 : window.frameElement).name
      )
    ) {
      logger.debug('loaded from google ads iframe');
      return window.frameElement;
    } else {
      return (_a2 = target == null ? void 0 : target.parentElement) == null
        ? void 0
        : _a2.parentElement;
    }
  };
  const ENABLE_LOGGING = window.location.search.includes(
    'STORYLINES_LOG_LEVEL'
  );
  function log(message, data) {
    if (ENABLE_LOGGING) {
      console.log(`[storylines-bridge] ${message}`, data);
    }
  }
  function getFrameByEvent(event) {
    const isAncestor = (childWindow, frameWindow) => {
      if (frameWindow === childWindow) {
        return true;
      } else if (childWindow === window.top) {
        return false;
      }
      return isAncestor(childWindow.parent, frameWindow);
    };
    const iframeThatMatchesSource = Array.from(
      document.getElementsByTagName('iframe')
    ).find((frame) => isAncestor(event.source, frame.contentWindow));
    return iframeThatMatchesSource || null;
  }
  const classNames = {
    container: 'storylines-container',
    expandedBody: 'seenthis-storylines-fullscreen',
  };
  const frameElements = {};
  const containerElements = {};
  const initializeBridge = () => {
    const body = document.querySelector('body');
    log('[storylines-bridge]: init');
    window.addEventListener('message', (event) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      switch (event.data.type) {
        case 'storylines:init': {
          log(`[storylines-bridge]: init`, {
            origin: event.origin,
            storyKey: event.data.storyKey,
            fixes: event.data.fixes,
          });
          if (!verifyOrigin(event)) return;
          const storyKey = event.data.storyKey;
          frameElements[storyKey] = getFrameByEvent(event);
          containerElements[storyKey] =
            (_a2 = frameElements[storyKey]) == null
              ? void 0
              : _a2.parentElement;
          if (!frameElements[storyKey] || !containerElements[storyKey]) {
            console.error('[storylines-bridge]: iframe or container not found');
            return;
          }
          event.source.postMessage('storylines:init-ok', '*');
          const fixesToApply = event.data.fixes;
          applyCss();
          if (fixesToApply.includes('full-width')) {
            (_c = (_b = fixes['full-width']).js) == null
              ? void 0
              : _c.call(_b, containerElements[storyKey]);
          }
          if (fixesToApply.includes('auto-height')) {
            (_e = (_d = fixes['auto-height']).js) == null
              ? void 0
              : _e.call(_d, containerElements[storyKey]);
          }
          (_f = containerElements[storyKey]) == null
            ? void 0
            : _f.classList.add(classNames.container);
          calculateMargins(containerElements[storyKey]);
          break;
        }
        case '@seenthis_modal/beforeopen': {
          const storyKey = event.data.detail.storyKey;
          if (!verifyOrigin(event)) return;
          body == null ? void 0 : body.classList.add(classNames.expandedBody);
          (_g = containerElements[storyKey]) == null
            ? void 0
            : _g.classList.add('expanded');
          break;
        }
        case '@seenthis_modal/beforeclose': {
          const storyKey = event.data.detail.storyKey;
          if (!verifyOrigin(event)) return;
          body == null
            ? void 0
            : body.classList.remove(classNames.expandedBody);
          (_h = containerElements[storyKey]) == null
            ? void 0
            : _h.classList.remove('expanded');
          break;
        }
      }
      if (BROADCAST_EVENT_TYPES.includes(event.data.type)) {
        window.dispatchEvent(
          new CustomEvent(event.data.type, { detail: event.data })
        );
      }
    });
  };
  function verifyOrigin(event) {
    const allowedOrigins = ['https://video.seenthis.se'];
    if (!allowedOrigins.includes(event.origin)) {
      console.error(
        `[storylines-bridge]: origin not allowed: ${event.origin}.`
      );
      return false;
    }
    return true;
  }
  function applyCss() {
    const style = document.createElement('style');
    style.textContent = STORYLINES_IFRAME_CSS;
    document.head.appendChild(style);
  }
  function attachBridge() {
    if (window.__storylines_bridge_attached) {
      log('already attached');
      return;
    }
    window.__storylines_bridge_attached = true;
    if (
      document.readyState === 'interactive' ||
      document.readyState === 'complete'
    ) {
      initializeBridge();
    } else {
      document.addEventListener('DOMContentLoaded', initializeBridge);
    }
  }
  attachBridge();
});
