/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { BroadcastChannel } from 'broadcast-channel';
import { namespace as ServiceNamespace } from '../namespace';
const { detect } = require('detect-browser');
const browser = detect();
const isSafari = browser?.name === 'safari';
class BroadCastManager {
  constructor() {
    this._loginChannel = new BroadcastChannel(
      'login',
      isSafari ? { type: 'localstorage' } : {},
    );
    this._logoutChannel = new BroadcastChannel(
      'logout',
      isSafari ? { type: 'localstorage' } : {},
    );
    this._refreshChannel = new BroadcastChannel(
      'refresh',
      isSafari ? { type: 'localstorage' } : {},
    );
    this._loginListeners = [];
    this._logoutListeners = [];
    this._refreshListeners = [];
    this._loginChannel.onmessage = ({ msg, namespace }) => {
      this._loginListeners.forEach((func) => {
        func(msg, namespace);
      });
    };
    this._logoutChannel.onmessage = ({ msg, namespace }) => {
      this._logoutListeners.forEach((func) => {
        func(msg, namespace);
      });
    };
    this._refreshChannel.onmessage = ({ msg, namespace }) => {
      this._refreshListeners.forEach((func) => {
        func(msg, namespace);
      });
    };
  }

  addListener(channel, func) {
    switch (channel) {
      case 'login': {
        this._loginListeners.push(func);
        break;
      }
      case 'logout': {
        this._logoutListeners.push(func);
        break;
      }
      case 'refresh': {
        this._refreshListeners.push(func);
        break;
      }
      default: {
        throw new Error(`the channel should be 'login'|'logout'|'refresh'`);
      }
    }
  }

  postMessage(channel, namespace, msg) {
    if (!Object.values(ServiceNamespace.broadCast).includes(namespace)) {
      throw new Error(
        'the namespace is not defined on broadcast namespace file',
      );
    }
    if (typeof namespace !== 'string') {
      throw new Error('a unique namespace is necessary');
    }
    switch (channel) {
      case 'login': {
        this._loginChannel.postMessage({ msg, namespace });
        break;
      }
      case 'logout': {
        this._logoutChannel.postMessage({ msg, namespace });
        break;
      }
      case 'refresh': {
        this._refreshChannel.postMessage({ msg, namespace });
        break;
      }
      default: {
        throw new Error(`the channel should be 'login'|'logout'|'refresh'`);
      }
    }
  }
}

const broadcastManager = new BroadCastManager();
export { broadcastManager };
