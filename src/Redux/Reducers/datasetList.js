/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {
  ADD_DATASET_LIST,
  CLEAN_DATASET_LIST,
  SET_DATASET_LIST,
  UPDATE_DATASET_LIST,
} from '../actionTypes';

export default function (state = [], action) {
  switch (action.type) {
    case ADD_DATASET_LIST: {
      const { datasetList, title } = action.payload;
      if (!state.length) {
        return [
          {
            datasetList,
            title: 'All Projects',
            key: 0,
          },
        ];
      } else {
        const newState = state.slice(0);

        newState.push({
          datasetList,
          key: state[newState.length - 1].key + 1,
          title: title || `query${state[newState.length - 1].key + 1}`,
        });
        return newState;
      }
    }
    case UPDATE_DATASET_LIST: {
      const { datasetList, title } = action.payload;
      const newState = [];

      if (state.length) {
        for (const item of state) {
          if (item.title === title) {
            item.datasetList = datasetList;
          }
          newState.push(item);
        }
      }

      return newState;
    }
    case CLEAN_DATASET_LIST: {
      return [];
    }
    case SET_DATASET_LIST: {
      const { allDatasetLists } = action.payload;
      return allDatasetLists;
    }
    default:
      return state;
  }
}
