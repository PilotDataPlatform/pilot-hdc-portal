/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function useFetch(key, contextObject) {
  const fileExplorerTableState = useSelector(
    (state) => state.fileExplorerTable,
  );
  const dispatch = useDispatch();
  const {
    data,
    loading,
    pageSize,
    page,
    total,
    columnsComponentMap,
    isSidePanelOpen,
    selection,
    currentPlugin,
    refreshNum,
    hardFreshKey,
    currentGeid,
    orderType,
    orderBy,
  } = fileExplorerTableState[key] || {};

  const toPage = (page) => {
    contextObject.toPage();
  };
  const changePageSize = (pageSize) => {};

  const refresh = () => {};

  const hardRefresh = () => {};

  const customizeFetch = (paramsObject) => {};

  const fetcher = {
    toPage,
    changePageSize,
    refresh,
    hardRefresh,
    customizeFetch,
  };
  return fetcher;
}
