/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { useSelector, useDispatch } from 'react-redux';
import { fileExplorerTableActions } from '../../../../Redux/actions';
import { useCurrentProject } from '../../../../Utility';
import { fetchTableData } from './dataFetcher';

export function useDataFetcher(reduxKey) {
  const dispatch = useDispatch();
  const fileExplorerTableState = useSelector(
    (state) => state.fileExplorerTable,
  );
  const { activeReq } = useSelector((state) => state.request2Core);
  const [currentDataset] = useCurrentProject();
  const projectCode = currentDataset?.code;
  if (!fileExplorerTableState[reduxKey]) {
    dispatch(fileExplorerTableActions.setAdd({ geid: reduxKey }));
  }

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
    filter,
  } = fileExplorerTableState[reduxKey] || {};

  return {
    goToRoute(geid, isRoot) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        0,
        10,
        'uploaded_at',
        'desc',
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    init(geid) {
      return fetchTableData(
        'request',
        true,
        geid,
        page,
        pageSize,
        'uploaded_at',
        'desc',
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    refresh(geid, isRoot) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        page,
        pageSize,
        orderType,
        orderBy,
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    pageTo(geid, isRoot, page) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        page,
        pageSize,
        orderBy,
        orderType,
        filter,
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    changeSorterAndPagination(geid, isRoot, page, sort, order, filter) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        page,
        pageSize,
        sort,
        order,
        filter,
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    changePageSize(geid, isRoot, pageSize) {
      return fetchTableData(
        'request',
        isRoot,
        geid,
        page,
        pageSize,
        orderType,
        orderBy,
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
    goToFolder(geid) {
      return fetchTableData(
        'request',
        false,
        geid,
        0,
        10,
        'uploaded_at',
        'desc',
        {},
        projectCode,
        dispatch,
        reduxKey,
      );
    },
  };
}
