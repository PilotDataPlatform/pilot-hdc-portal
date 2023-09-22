/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { keycloak } from './config';
import moment from 'moment';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import workerTimer from '../../Utility/workerTimer/worker-timer';
class TokenTimer {
  listeners;
  constructor() {
    this.listeners = [];
    this.lastTimeRemain = null;
    const self = this;
    workerTimer.setInterval(() => {
      self._traverseListeners();
    }, 1000);
  }

  getRefreshRemainTime() {
    const remainTime =
      keycloak.refreshTokenParsed?.exp - (moment().unix() - keycloak.timeSkew);
    return isNaN(remainTime) ? -1 : remainTime;
  }

  checkSession() {
    const isSessionOn = this.getRefreshRemainTime() >= 0;
    return isSessionOn;
  }

  getAccessRemainTime() {
    const remainTime =
      keycloak.tokenParsed?.exp - (moment().unix() - keycloak.timeSkew);
    return isNaN(remainTime) ? -1 : remainTime;
  }
  resetLastTimeRemain() {
    this.lastTimeRemain =
      keycloak.refreshTokenParsed?.exp -
      (keycloak.refreshTokenParsed?.iat - keycloak.timeSkew);
  }

  _traverseListeners() {
    const timeRemain = this.getRefreshRemainTime();
    const accessTimeRemain = this.getAccessRemainTime();
    this.listeners.forEach((item) => {
      const { func, condition } = item;
      if (condition(timeRemain, accessTimeRemain, this.lastTimeRemain)) {
        func();
      }
    });
    this.lastTimeRemain = timeRemain;
  }

  addListener(listener) {
    const listenerId = uuidv4();
    const { func, condition = (timeRemain) => false } = listener;
    if (!_.isFunction(func)) {
      throw new Error('the listener.func should be a function');
    }
    if (condition && !_.isFunction(condition)) {
      throw new Error('the listener.condition should be a function');
    }
    this.listeners.push({ func, condition, listenerId });
    return listenerId;
  }

  removeListener(listenerId) {
    if (typeof listenerId !== 'string') {
      throw new Error('the listenerId should be an string');
    }
    _.remove(this.listeners, (item) => item.listenerId === listenerId);
  }
}

const tokenTimer = new TokenTimer();
export { tokenTimer };
