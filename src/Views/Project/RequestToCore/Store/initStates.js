/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
export const initStates = {
  loading: false,
  currentPlugin: '',
  route: [],
  page: 0,
  total: 0,
  pageSize: 10,
  sortBy: 'createTime',
  sortOrder: 'desc',
  filter: {},
  columnsComponentMap: null,
  dataOriginal: [],
  data: [],
  selection: [],
  propertyRecord: null,
  isSidePanelOpen: false,
  refreshNum: 0,
  sourceType: 'Project',
  currentGeid: '',
  hardFreshKey: 0,
};
