/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { listDatasetFiles } from '../../../../../APIs';
import { datasetDataActions } from '../../../../../Redux/actions';
import { store } from '../../../../../Redux/store';

async function initTree() {
  const datasetInfo = store.getState().datasetInfo.basicInfo;
  const datasetGeid = datasetInfo.geid;

  const res = await listDatasetFiles(datasetGeid, null, {});
  store.dispatch(datasetDataActions.resetTreeKey());
  store.dispatch(datasetDataActions.setTreeData(res?.data?.result?.data));
  store.dispatch(datasetDataActions.setTreeLoading(false));
}

export { initTree };
