/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { Cookies } from 'react-cookie';
import { axios } from '../../APIs/config';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import workerTimer from '../../Utility/workerTimer/worker-timer';
import { DOMAIN, API_PATH } from '../../config';

function calCommonDomain(domain1, domain2) {
  const domainArr = domain1.split('.');
  let commonArr = [];
  for (let i = domainArr.length - 1; i >= 0; i--) {
    commonArr.unshift(domainArr[i]);
    if (domain2.indexOf('.' + commonArr.join('.')) !== -1) {
      continue;
    } else {
      commonArr.shift();
      break;
    }
  }
  return commonArr;
}
const largeDate = Infinity;
class TokenManager {
  cookies;
  setTimeId;
  listeners;
  constructor() {
    const commonArr = calCommonDomain(DOMAIN, API_PATH);
    this.domain = '.' + commonArr.join('.');
    this.cookies = new Cookies();
    this.listeners = [];
    const self = this;
    workerTimer.setInterval(() => {
      self._traverseListeners();
    }, 1000);
  }

  getLocalCookie(name) {
    if (typeof name !== 'string') {
      throw new Error(`the name argument should be a string`);
    }
    return this.cookies.get(name);
  }
  setLocalCookies(newCookies) {
    Object.keys(newCookies).forEach((key) => {
      this.cookies.set(key, newCookies[key], {
        path: '/',
      });
    });
  }

  setServerCookies(newCookies) {
    Object.keys(newCookies).forEach((key) => {
      this.cookies.set(key, newCookies[key], {
        path: '/',
        domain: this.domain,
      });
      this.cookies.set(key, newCookies[key], {
        path: '/',
        domain: 'localhost',
      });
    });
  }

  refreshToken(accessToken) {
    accessToken = accessToken || this.getLocalCookie('access_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  _traverseListeners() {
    const timeRemain = this.getTokenTimeRemain();
    this.listeners.forEach((item) => {
      const { time, func, condition, params } = item;
      if (condition(timeRemain, time)) {
        func(...params);
      }
    });
  }

  addListener(listener) {
    const listenerId = uuidv4();
    const {
      time,
      func,
      condition = (timeRemain, time) => timeRemain === time,
      params = [],
    } = listener;
    if (typeof time !== 'number') {
      throw new Error('the time should be a number');
    }
    if (!_.isFunction(func)) {
      throw new Error('the listener.func should be a function');
    }
    if (condition && !_.isFunction(condition)) {
      throw new Error('the listener.condition should be a function');
    }
    if (params && !Array.isArray(params)) {
      throw new Error(
        `the params for func should be grouped into an array in order`,
      );
    }
    this.listeners.push({ time, func, condition, params, listenerId });
    return listenerId;
  }

  removeListener(listenerId) {
    if (typeof listenerId !== 'string') {
      throw new Error('the listenerId should be an string');
    }
    _.remove(this.listeners, (item) => item.listenerId === listenerId);
  }

  getTokenTimeRemain(token) {
    token = token || this.getLocalCookie('access_token');
    if (!token) {
      return -largeDate;
    } else {
      const exp = jwtDecode(token).exp;
      return exp - (moment().unix() - this.getLocalCookie('timeSkew'));
    }
  }

  getMaxTime() {
    const token = this.getLocalCookie('access_token');
    if (!token) {
      return -largeDate;
    } else {
      const time = jwtDecode(token).exp - jwtDecode(token).iat;
      return time;
    }
  }

  setTimeSkew(accessToken) {
    const timeSkew =
      Math.floor(new Date().getTime() / 1000) - jwtDecode(accessToken).iat;
    this.setLocalCookies({ timeSkew });
  }

  clearCookies() {
    Object.keys(this.cookies.getAll()).forEach((key) => {
      this.cookies.remove(key, { path: '/' });
    });
  }

  checkTokenUnExpiration() {
    const token = this.getLocalCookie('access_token');

    if (token && this.getTokenTimeRemain() >= 0) {
      return true;
    } else {
      return false;
    }
  }
}

const tokenManager = new TokenManager();
export default tokenManager;
