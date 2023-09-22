/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import _ from 'lodash';
import { store } from '../../../../../Redux/store';
import { listDatasetFiles } from '../../../../../APIs';
import { datasetDataActions } from '../../../../../Redux/actions';
import { message } from 'antd';
import i18n from '../../../../../i18n';

async function fetchDatasetFiles(datasetGeid) {
  store.dispatch(datasetDataActions.setTreeLoading(true));
  try {
    const res = await listDatasetFiles(datasetGeid, null, {});
    store.dispatch(datasetDataActions.setTreeData(res?.data?.result?.data));
  } catch {
    message.error(i18n.t('errormessages:listDatasets.default.0'));
  }
  store.dispatch(datasetDataActions.setTreeLoading(false));
}

function onTransferFinish(datasetGeid) {
  fetchDatasetFiles(datasetGeid);
}

function onRenameFinish(payload, oldTreeData, datasetGeid) {
  const targetNode = findNodeWithGeid(
    { children: oldTreeData },
    payload.globalEntityId,
  );

  if (targetNode) {
    fetchDatasetFiles(datasetGeid);
  }
}

function onImportFinish(payload, oldTreeData, datasetGeid) {
  if (!oldTreeData.find((x) => x.id === payload.globalEntityId)) {
    fetchDatasetFiles(datasetGeid);
  }
}

function onDeleteFinish(payload, treeData, datasetGeid) {
  if (treeData.length && payload.globalEntityId) {
    fetchDatasetFiles(datasetGeid);
  }
}

const findNodeWithGeid = (obj, target) => {
  if (!target || !_.isString(target))
    throw new Error('target geid should not be empty');
  if (!obj) return null;

  if (obj.globalEntityId === target) {
    return obj;
  }

  if (!_.isArray(obj.children)) return null;

  for (let i = 0; i < obj.children.length; i++) {
    const child = obj.children[i];
    const childRes = findNodeWithGeid(child, target);
    if (childRes) {
      return childRes;
    }
  }

  return null;
};

const deleteNodeWithGeids = (treeNodes, geids) => {
  return treeNodes
    .map((node) => {
      if (geids.indexOf(node.globalEntityId) !== -1) {
        return null;
      }

      if (node.children) {
        return {
          ...node,
          children: deleteNodeWithGeids(node.children, geids),
        };
      }

      return node;
    })
    .filter((v) => !!v);
};

export {
  deleteNodeWithGeids,
  onTransferFinish,
  onRenameFinish,
  onImportFinish,
  onDeleteFinish,
  fetchDatasetFiles,
};
