/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { initStates } from './initStates';
import { explorerReducer, actions } from './reducers';

function useFileExplorer() {
  const [state, dispatch] = useReducer(explorerReducer, initStates);

  const memoState = useMemo(() => state, [state]);
  const dataFetcher = {};
  return [memoState, dataFetcher];
}
