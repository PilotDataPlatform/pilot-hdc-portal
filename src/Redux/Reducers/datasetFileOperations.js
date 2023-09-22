/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { DATASET_FILE_OPERATION } from '../actionTypes';
import { cloneDeep } from 'lodash';

const init = {
  import: [],
  rename: [],
  delete: [],
  move: [],
};

const updateStateByAction = (state, action, payload) => {
  const newState = cloneDeep(state);
  const payloadOperator = payload.sessionId.split('-')[0];
  const existingItemIndex = newState[action].findIndex(
    (item) =>
      item.jobId === payload.jobId ||
      (item.operator === payloadOperator &&
        item.datasetCode === payload.containerCode &&
        payload.name.includes(item.name)),
  );

  if (existingItemIndex < 0) {
    return state;
  }

  newState[action][existingItemIndex] = {
    ...newState[action][existingItemIndex],
    ...payload,
  };
  delete newState[action][existingItemIndex].datasetCode;

  return newState;
};

export function datasetFileOperations(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case DATASET_FILE_OPERATION.SET_IMPORT: {
      const newState = cloneDeep(state);
      newState.import = [...newState.import, payload];
      return newState;
    }

    case DATASET_FILE_OPERATION.SET_DELETE: {
      const newState = cloneDeep(state);
      newState.delete = [...newState.delete, payload];
      return newState;
    }

    case DATASET_FILE_OPERATION.SET_RENAME: {
      const newState = cloneDeep(state);
      newState.rename = [...newState.rename, payload];
      return newState;
    }

    case DATASET_FILE_OPERATION.SET_MOVE: {
      const newState = cloneDeep(state);
      newState.move = [...newState.move, payload];
      return newState;
    }

    case DATASET_FILE_OPERATION.UPDATE_IMPORT: {
      return updateStateByAction(state, 'import', payload);
    }

    case DATASET_FILE_OPERATION.UPDATE_DELETE: {
      return updateStateByAction(state, 'delete', payload);
    }

    case DATASET_FILE_OPERATION.UPDATE_RENAME: {
      return updateStateByAction(state, 'rename', payload);
    }

    case DATASET_FILE_OPERATION.UPDATE_MOVE: {
      return updateStateByAction(state, 'move', payload);
    }

    default: {
      return state;
    }
  }
}
