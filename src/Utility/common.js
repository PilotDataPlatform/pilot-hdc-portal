/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
exports.sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

exports.getFileSize = (size, options = {}) => {
  options.roundingLimit = options.roundingLimit ?? 2;

  return size < 1024
    ? size.toString().concat(' B')
    : size < 1024 * 1024
    ? (size / 1024).toFixed(options.roundingLimit).toString().concat(' KB')
    : size < 1024 * 1024 * 1024
    ? (size / (1024 * 1024))
        .toFixed(options.roundingLimit)
        .toString()
        .concat(' MB')
    : (size / (1024 * 1024 * 1024))
        .toFixed(options.roundingLimit)
        .toString()
        .concat(' GB');
};

exports.trimString = (str) => {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

exports.currentBrowser = () => {
  let userAgentString = window.navigator.userAgent;

  let safariAgent = userAgentString.indexOf('Safari') > -1;
  let chromeAgent = userAgentString.indexOf('Chrome') > -1;
  if (chromeAgent && safariAgent) safariAgent = false;

  return safariAgent;
};

exports.toFixedNumber = (x) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = '0.' + new Array(e).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join('0');
    }
  }
  return x;
};

exports.isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return isNaN(str);
};
