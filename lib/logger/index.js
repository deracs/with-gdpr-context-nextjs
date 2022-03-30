import getConfig from 'next/config';

const LOG_LEVELS = {
  VERBOSE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  TABLE: 6,
};

/**
 * Write logs
 * @class Logger
 */
class Logger {
  name;

  level;

  /**
   * @constructor
   * @param {string} name - Name of the logger
   * @param level
   */
  constructor(name, level = 'WARN') {
    this.name = name;
    this.level = level;
  }

  static LOG_LEVEL = null;

  // eslint-disable-next-line no-underscore-dangle,class-methods-use-this
  _padding(n) {
    return n < 10 ? `0${n}` : `${n}`;
  }

  // eslint-disable-next-line no-underscore-dangle
  _ts() {
    const dt = new Date();
    return (
        // eslint-disable-next-line no-underscore-dangle
        `${[this._padding(dt.getMinutes()), this._padding(dt.getSeconds())].join(
            ':',
        )}.${dt.getMilliseconds()}`
    );
  }

  /**
   * Write log
   * @method
   * @memeberof Logger
   * @param {string} type - log type, default INFO
   * @param {string|object} msg - Logging message or object
   */
  // eslint-disable-next-line no-underscore-dangle
  _log(type, ...msg) {
    let loggerLevelName = this.level;
    const {  publicRuntimeConfig } = getConfig()
    if (Logger.LOG_LEVEL) {
      loggerLevelName = Logger.LOG_LEVEL;
    }
    if (publicRuntimeConfig?.logger?.level){
      loggerLevelName = publicRuntimeConfig?.logger?.level;
    }
    if (typeof window !== 'undefined' && window.LOG_LEVEL) {
      loggerLevelName = window.LOG_LEVEL;
    }
    const loggerLevel = LOG_LEVELS[loggerLevelName];
    const typeLevel = LOG_LEVELS[type];

    if (!(typeLevel >= loggerLevel)) {
      // Do nothing if type is not greater than or equal to logger level (handle undefined)
      // console.log(':(', typeLevel, loggerLevel);
      return;
    }
    let log = console.log.bind(console);
    if (type === 'ERROR' && console.error) {
      log = console.error.bind(console);
    }
    if (type === 'WARN' && console.warn) {
      log = console.warn.bind(console);
    }
    if (type === 'TABLE' && console.table) {
      log = console.table.bind(console);
    }

    // eslint-disable-next-line no-underscore-dangle
    const prefix = `[${type}] ${this._ts()} ${this.name}`;

    if (type === 'TABLE') {
      console.log(`${prefix}`);
      log(msg);
    }
    if (msg.length === 1 && typeof msg[0] === 'string') {
      log(`${prefix} - ${msg[0]}`);
    } else if (msg.length === 1) {
      log(prefix, msg[0]);
    } else if (typeof msg[0] === 'string') {
      let obj = msg.slice(1);
      if (obj.length === 1) {
        obj = obj[0];
      }
      log(`${prefix} - ${msg[0]}`, obj);
    } else {
      log(prefix, msg);
    }
  }

  /**
   * Write General log. Default to INFO
   * @method
   * @memeberof Logger
   * @param {string|object} msg - Logging message or object
   */
  log(...msg) {
    // eslint-disable-next-line no-underscore-dangle
    this._log('INFO', ...msg);
  }

  /**
   * Write INFO log
   * @method
   * @memeberof Logger
   * @param {string|object} msg - Logging message or object
   */
  info(...msg) {
    // eslint-disable-next-line no-underscore-dangle
    this._log('INFO', ...msg);
  }

  /**
   * Write WARN log
   * @method
   * @memeberof Logger
   * @param {string|object} msg - Logging message or object
   */
  warn(...msg) {
    // eslint-disable-next-line no-underscore-dangle
    this._log('WARN', ...msg);
  }

  /**
   * Write ERROR log
   * @method
   * @memeberof Logger
   * @param {string|object} msg - Logging message or object
   */
  error(...msg) {
    // eslint-disable-next-line no-underscore-dangle
    this._log('ERROR', ...msg);
  }

  /**
   * Write DEBUG log
   * @method
   * @memeberof Logger
   * @param {string|object} msg - Logging message or object
   */
  debug(...msg) {
    // eslint-disable-next-line no-underscore-dangle
    this._log('DEBUG', ...msg);
  }

  /**
   * Write VERBOSE log
   * @method
   * @memeberof Logger
   * @param {string|object} msg - Logging message or object
   */
  verbose(...msg) {
    // eslint-disable-next-line no-underscore-dangle
    this._log('VERBOSE', ...msg);
  }

  /**
   * Write TABLE log
   * @method
   * @memeberof Logger
   * @param {string|object} msg - Logging message or object
   */
  table(...msg) {
    // eslint-disable-next-line no-underscore-dangle
    this._log('TABLE', ...msg);
  }
}

export default Logger;
