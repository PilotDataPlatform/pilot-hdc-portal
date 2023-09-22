/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { v4 as uuidv4 } from 'uuid';
import { CancelTokenSource } from 'axios';
import _ from 'lodash';

class AxiosCancelManager {
  constructor() {
    this._cancelSources = [];
  }

  addCancelSource(cancelSource) {
    if (!_.isFunction(cancelSource?.cancel)) {
      throw new TypeError(
        `addCancelSource should take in axios cancel source as parameter`,
      );
    }
    const sourceId = uuidv4();
    this._cancelSources.push({ sourceId, cancelSource });
    return sourceId;
  }

  removeCancelSource(sourceId) {
    if (!_.isString(sourceId)) {
      throw new TypeError(`sourceId should be a string`);
    }
    const removedArr = _.remove(
      this._cancelSources,
      (item) => item === sourceId,
    );
    return removedArr.length !== 0;
  }

  cancelAxios(sourceId) {
    if (!_.isString(sourceId)) {
      throw new TypeError(`sourceId should be a string`);
    }
    const item = _.find(
      this._cancelSources,
      (item) => item.sourceId === sourceId,
    );
    if (!item) {
      return false;
    } else {
      _.isFunction(item.cancelSource.cancel) && item.cancelSource.cancel();
      return this.removeCancelSource(sourceId);
    }
  }

  cancelAllAxios() {
    this._cancelSources.forEach((item) => {
      _.isFunction(item.cancelSource.cancel) && item.cancelSource.cancel();
    });
    this._cancelSources = [];
  }
}

const axiosCancelManager = new AxiosCancelManager();

export { axiosCancelManager };
