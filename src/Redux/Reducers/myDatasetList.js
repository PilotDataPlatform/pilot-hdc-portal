/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { MY_DATASET_LIST } from '../actionTypes';

const init = {
  loading: false,
  datasets: [],
  total: 0,
};

export function myDatasetList(state = init, action) {
  const { type, payload } = action;

  switch (type) {
    case MY_DATASET_LIST.SET_LOADING: {
      return { ...state, loading: payload };
    }

    case MY_DATASET_LIST.SET_DATASETS: {
      return { ...state, datasets: payload };
    }

    case MY_DATASET_LIST.SET_TOTAL: {
      return { ...state, total: payload };
    }

    default:
      return state;
  }
}
