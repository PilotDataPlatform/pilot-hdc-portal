/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useQueryParams(params) {
  if (!_.isArray(params)) {
    throw new TypeError('params should be an array of string');
  }
  const queryObj = useQuery();
  const query = {};
  for (const param of new Set(params)) {
    const res = queryObj.get(param);
    if (res) {
      query[param] = res;
    }
  }
  return query;
}
